from flask import request, jsonify
from application import mongo
from application import flask_bcrypt
from models.queueModel import validate_queue
from bson import json_util, ObjectId
import controllers.errors
import datetime

def createQueueItem():
    data = validate_queue(request.get_json())
    print('in queue! ', request.get_json())
    if data['ok']:
      data = data['data']
      
      predictionID = ObjectId(data['predictionID'])
      userID = ObjectId(data['userID'])
      
      newQueueItem = {}
      newQueueItem['predictionID'] = predictionID 
      newQueueItem['userID'] = userID
      
      newQueue = mongo.db.queue.insert_one(newQueueItem)
      return jsonify({'ok': True, 'message': 'Queue item created successfully!'}), 200
    else:
      print(data)
      return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400

def getQueueItem():
  return

def updateQueueItem():
  return

def deleteQueueItem():
  return