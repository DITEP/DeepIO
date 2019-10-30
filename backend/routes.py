from flask import Blueprint, request, jsonify
from flask_jwt_extended import (jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

import controllers.auth as auth
import controllers.user as user
import controllers.predict as prediction
import controllers.queue as queue
from application import jwt

routes = Blueprint('routes', __name__)

### Authentication
# Check user, create token, redirect

@routes.route('/login', methods=['POST'])
def loginUser():
    return auth.authUser()

# Boolean to check whether the current user is authenticated or not
@routes.route('/hasAuth', methods=['GET'])
@jwt_required
def checkAuth():
  try:
    token = request.headers.get('Authorization')
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
  except:
    return jsonify({'ok': False, 'message': 'invalid username or password'}), 401

# Revoke accessToken and put insert it into the blacklist
@routes.route('/logoutAccessToken', methods=['DELETE'])
@jwt_required
def logoutAccessToken():
    return auth.logout()

@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    return auth.checkIfTokenInBlackList(decrypted_token)

### User

# Get, create, update a single user
@routes.route('/user', methods = ['POST', 'GET', 'PUT'])
def userControl():
    if request.method == 'POST':
        return user.createUser()
    if request.method == 'GET':
        return user.getUserDetails()
    if request.method == 'PUT':
        return user.updateUser()

@routes.route('/changeEmail', methods = ['PUT'])
@jwt_required
def changeEmail(): 
    return user.changeEmail()

@routes.route('/checkPassword', methods = ['POST'])
@jwt_required
def checkPassword():
    return user.checkPassword()
    
@routes.route('/changePassword', methods = ['PUT'])
@jwt_required
def changePassword():
    return user.changePassword()

@routes.route('/updateUserHistory', methods = ['PUT'])
@jwt_required
def updateUserHistory():
    return user.updateUserHistory()    
    
###

### Predictions

# Get, create, update, delete a single job

@routes.route('/prediction', methods = ['POST', 'GET', 'PUT', 'DELETE'])
@jwt_required
def predictionControl():
    if request.method == 'POST':
        return prediction.createPrediction()
    if request.method == 'GET':
        return prediction.getPrediction()
    if request.method == 'PUT':
        return prediction.updatePrediction()
    if request.method == 'DELETE':
        return prediction.deletePrediction()
        
###

### Queue

# Get, create, update the entire job queue
@routes.route('/queue', methods = ['POST', 'GET', 'PUT', 'DELETE'])
@jwt_required
def queueControl():
    if request.method == 'POST':
        return queue.createQueueItem()
    if request.method == 'GET':
        return queue.getQueue()
    if request.method == 'PUT':
        return queue.updateQueueItem()
    if request.method == 'DELETE':
        return queue.deleteQueueItem()
###