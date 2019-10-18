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
from flask_jwt_extended import (JWTManager, create_access_token, create_refresh_token,
                                jwt_required, jwt_refresh_token_required, get_jwt_identity)

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
app.config['JWT_SECRET_KEY'] = 'SOOO_SECRET'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
mongo = PyMongo(app)        
app.json_encoder = JSONEncoder        
jwt = JWTManager(app)

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

@app.route('/hello', methods=['GET'])
@jwt_required
def hello():
  return 'hello'

@app.route('/login', methods=['POST'])
def auth_user():
  ''' login endpoint '''
  data = validate_user(request.get_json())
  if data['ok']:
    data = data['data']
    user = mongo.db.users.find_one({'email': data['email']})
    if user and flask_bcrypt.check_password_hash(user['password'], data['password']):
      del user['password']
      access_token = create_access_token(identity=data)
      refresh_token = create_refresh_token(identity=data)
      user['token'] = access_token
      user['refresh'] = refresh_token
      return jsonify({'ok': True, 'data': user}), 200
    else:
      return jsonify({'ok': False, 'message': 'invalid username or password'}), 401
  else:
    return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400

@app.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    ''' refresh token endpoint '''
    current_user = get_jwt_identity()
    ret = {
            'token': create_access_token(identity=current_user)
    }
    return jsonify({'ok': True, 'data': ret}), 200

if __name__ == '__main__':
    app.secret_key = os.urandom(24)
    app.run(host = "0.0.0.0", port = 8000, debug=True)