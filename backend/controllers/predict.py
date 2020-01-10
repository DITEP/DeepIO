from flask import request, jsonify
from application import mongo
from application import flask_bcrypt
from models.predictionModel import validate_prediction
from bson import json_util, ObjectId
import controllers.errors
import datetime

# Make timestamp, get user, save new prediction
def createPrediction():
  data = validate_prediction(request.get_json())
  if data['ok']:
    data = data['data']
    user = mongo.db.users.find_one({'email': data['submittedBy']})
    data['submittedBy'] = user['_id']
    data['timeStarted'] = datetime.datetime.utcnow()
    
    data['result'] = None
    data['timeEnded'] = None
    
    newPrediction = mongo.db.predictions.insert_one(data).inserted_id
    return jsonify({'ok': True, 'data': newPrediction }), 200
  else:
    return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400

def getPrediction():
  return

def updatePrediction():
  return

# Get prediction, get link to associated file, remove prediction, return link to file
def deletePrediction():
  try:
    data = request.get_json()
    predictionID = data['predictionID']
    prediction = mongo.db.predictions.find_one({'_id': ObjectId(predictionID)})
    fileToRemove = {}
    fileToRemove['filename'] = str(prediction.get('storedAt'))
    mongo.db.predictions.remove(prediction)
    return jsonify({'ok': True, 'data': fileToRemove }), 200
  except:
    return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400