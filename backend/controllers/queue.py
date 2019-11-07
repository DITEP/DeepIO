from flask import request, jsonify
from application import mongo
from application import flask_bcrypt
from models.queueModel import validate_queue
from bson import json_util, ObjectId
from flask_jwt_extended import (get_jwt_identity)

import controllers.errors
import datetime

# Cast data in strings as mongoDB ObjectIDs, save in database
def createQueueItem():
    data = validate_queue(request.get_json())
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

# Queue user and prediction collection for the IDs saved in queue, flatten return value, only return the three values in project back to frontend
def getQueue():
  try:
    queue = mongo.db.queue.aggregate(
      [
        {"$lookup": {"from": "users", "foreignField": "_id", "localField": "userID", "as": "user"}},
        {"$lookup": {"from": "predictions", "foreignField": "_id", "localField": "predictionID", "as": "prediction"}},
        {"$unwind": "$user"},
        {"$unwind": "$prediction"},
        {"$project": {"user.name": 1, "user.email": 1, "prediction.predictionTitle": 1, "prediction.timeStarted": 1}},
      ]
    )
    queue = json_util.dumps(queue)
    return queue, 200
  except:
    return jsonify({'ok': False, 'message': 'Bad request parameters: {}'}), 400

def updateQueueItem():
  return

# Get the current user
# Find queue item in db by its ID
# Get user who owns prediction from queue item
# If current user == owner -> delete queue item
# Return the prediction ID and user ID which were stored inside the queue item
def deleteQueueItem():
  try:
    current_user = get_jwt_identity()
    user = mongo.db.users.find_one({'email': current_user['email']})
    
    data = request.get_json()
    itemToDelete = mongo.db.queue.find_one({'_id': ObjectId(data['queueID'])})
    ids = {}
    ids['userID'] = itemToDelete['userID']
    ids['predictionID'] = itemToDelete['predictionID']
    
    creator = mongo.db.users.find_one({'_id': ids['userID']})
    
    if user['email'] == creator['email']:
      mongo.db.queue.remove(itemToDelete)
      return json_util.dumps(ids), 200
    else:
      return jsonify({'ok': False, 'message': 'Unauthorized! parameters: {}'}), 401
  except:
    return jsonify({'ok': False, 'message': 'Bad request parameters: {}'}), 400