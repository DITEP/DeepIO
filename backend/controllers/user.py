from flask import request, jsonify
from application import mongo
from application import flask_bcrypt
from models.userModel import validate_user
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                get_jwt_identity, get_raw_jwt)
import controllers.errors

# Try to find email address in database. If it is unique, make new user. Otherwise send error message
def createUser():
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
      return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400

def getUser():
    query = request.args
    data = mongo.db.users.find_one({'email': query['email']})
    if data:
      return jsonify(data), 200
    return jsonify({'ok': False, 'message': 'No user!'}), 400

def updateUser():
    return

def changePassword():
    current_user = get_jwt_identity()
    data = request.get_json()
    try:
      data['password'] = flask_bcrypt.generate_password_hash(data['password'])
      print(current_user['email'], data['password'])
      currentUser = mongo.db.users.update_one({'email': current_user['email']}, {'$set': {'password': data['password']}}, upsert=False)
      print (currentUser)
      return jsonify({'ok': True, 'message': 'Email updated successfully!'}), 200
    except:
      return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400
    
def changeEmail():
    data = validate_user(request.get_json())
    if data['ok']:
      data = data['data']
      userExists = mongo.db.users.find_one({'email': data['newEmail']})
      if not userExists:
        currentUser = mongo.db.users.update_one({'email': data['email']}, {'$set': {'email': data['newEmail']}}, upsert=False)
        return jsonify({'ok': True, 'message': 'Email updated successfully!'}), 200
      else:
        return jsonify({'ok': False, 'message': 'User exists parameters!'}), 409
    return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400
