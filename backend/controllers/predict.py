from flask import request, jsonify
from application import mongo
from application import flask_bcrypt
from models.predictionModel import validate_prediction
from bson import json_util
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
      newPrediction = mongo.db.predictions.insert_one(data).inserted_id
      return jsonify({'ok': True, 'data': newPrediction }), 200
    else:
      return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400

def getPrediction():
  return

def updatePrediction():
  return

def deletePrediction():
  return