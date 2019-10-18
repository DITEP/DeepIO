# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, url_for, session, flash, redirect, jsonify
import os
from flask_pymongo import PyMongo
import json
from bson.objectid import ObjectId
import datetime
import threading
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from models.userModel import validate_user

class JSONEncoder(json.JSONEncoder):                           
  ''' extend json-encoder class'''
  def default(self, o):                               
    if isinstance(o, ObjectId):
      return str(o)                               
    if isinstance(o, datetime.datetime):
      return str(o)
    return json.JSONEncoder.default(self, o)

app = Flask(__name__, static_folder='../frontend/deepio/public/dist', template_folder='../frontend/deepio/public/')
CORS(app)
flask_bcrypt = Bcrypt(app)
app.config["MONGO_URI"] = "mongodb://localhost:27017/deepio"
mongo = PyMongo(app)        
app.json_encoder = JSONEncoder        


@app.route('/',methods=['GET','POST'])
def index():
  '''
  if not session.get('logged_in'):
      return redirect(url_for('client_login'))
  else:
      return render_template("index.html")
  '''
  return render_template("index.html")

@app.route('/user', methods = ['POST', 'GET'])
def user():
  if request.method == 'POST':
    ''' register user endpoint '''
    data = validate_user(request.get_json())    
    if data['ok']:
      data = data['data']
      userExists = mongo.db.users.find_one({'email': data['email']})
      if not userExists:        
        data['password'] = flask_bcrypt.generate_password_hash(
          data['password'])
        print('data data data', data)
        print (mongo.db.users)
        result = mongo.db.users.insert_one(data)
        return jsonify({'ok': True, 'message': 'User created successfully!'}), 200
      else:
        return jsonify({'ok': False, 'message': 'User exists parameters!'}), 409          
    else:
      return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400      

  if request.method == 'GET':
    query = request.args
    data = mongo.db.users.find_one(query)
    return jsonify(data), 200

@app.route('/hello')
def hello():
  return getHello()
  
def getHello():
  return 'hello'

@app.route('/login', methods=['POST'])
def auth_user():
  ''' login endpoint '''
  data = validate_user(request.get_json())
  print('returning user ', data)
  if data['ok']:
    data = data['data']
    print(data)
    user = mongo.db.users.find_one({'email': data['email']})
    if user and flask_bcrypt.check_password_hash(user['password'], data['password']):
      del user['password']
      print(user)
      return jsonify({'ok': True, 'data': user}), 200
    else:
      return jsonify({'ok': False, 'message': 'invalid username or password'}), 401
  else:
    return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400

#### La route pour effectuer le calcul de la prediction à l'aide du script 'pred'. En plus du resultat, on retourne également des éléments
### utiles à la visualisation (attentions et sentebces)
@app.route('/pred', methods = ['POST'])
def predict():
    #if session.get('logged_in'):
    data = request.get_json()
    if data['text'] != "":
        (prediction, sentences,sentence_attentions,word_attentions) = pred([data['text']],app.root_path)
        res = {}
        res['result'] = round(float(prediction)*100, 3)
        #attentions, colors et  sentences sont des listes de liste au cas ou plusieurs textes
        #sont envoyés à la fonction pred. Ici, comme on envoie qu'un seul text, on récupère toujours
        #le premier élement de ces listes.
        res['sentence_attentions'] = sentence_attentions.tolist()[0]
        res['word_attentions'] = word_attentions.tolist()[0]
        res['sentences'] = sentences[0]
        
        #DB stuff
        '''
        #Writing text into database
        with connection as cursor:
            insert_text = "INSERT INTO `reports` (`Practitioner`,`NIP`,`Text`,`Result`,`DateCr`,`DateInc`) Values (%s,%s,%s,%s,%s,%s)"
            cursor.execute(insert_text, (session['id'],data['nip'],data['text'],res['result'],data['dateCr'],data['dateInc']))


        #get id of inserted column
        with connection as cursor:
            get_id = "SELECT LAST_INSERT_ID();"
            cursor.execute(get_id)
            idReport = cursor.fetchone()['LAST_INSERT_ID()']

        #Writing attentions into database
        attention_thread = threading.Thread(target = insert_attention, args = (connection,idReport,res['sentences'],res['sentence_attentions'],res['word_attentions']))
        attention_thread.start()
        '''
        
        res['result'] = str(res['result']) + '%'
        
        return jsonify(res)

    else:
        return jsonify("0%")


def insert_attention(connection,id,sentences,sentence_attentions,word_attentions):
    NUM_SENTENCES = len(sentences)
    NUM_WORDS = len(word_attentions[0])
    for i in range(NUM_SENTENCES):
        #Insert sentence attention
        with connection as cursor:
            insert_word = 'INSERT INTO attentions (ReportNb,SentenceNb,WordNb,AttentionValue) VALUES (%s,%s,%s,%s)'
            cursor.execute(insert_word,(id,i,-1,sentence_attentions[i]))

        #Insert word attention for each word in the sentence
        for j in range(NUM_WORDS):
            with connection as cursor:
                insert_word = 'INSERT INTO attentions (ReportNb,SentenceNb,WordNb,AttentionValue) VALUES (%s,%s,%s,%s)'
                cursor.execute(insert_word,(id,i,j,word_attentions[i][j]))

    return -1

@app.route('/patients', methods = ['GET'])
def patients():
    return 'Page under construction'
    '''
    if session.get('logged_in'):
        with connection as cursor:
            sql = "SELECT * FROM reports WHERE Practitioner = %s"
            cursor.execute(sql,(session['id']))
            patients = cursor.fetchall()
        return render_template('patients.html',patients=patients)
    else:
        return redirect(url_for('client_login'))
    '''

if __name__ == '__main__':
    app.secret_key = os.urandom(24)
    app.run(host = "0.0.0.0", port = 8000, debug=True)