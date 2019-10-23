from flask import Blueprint, request, jsonify
from flask_jwt_extended import (jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

import controllers.auth as auth
import controllers.user as user
#import controllers.job as job
import controllers.queue as queue
from application import jwt

routes = Blueprint('routes', __name__)

### Authentication
# Check user, create token, redirect

@routes.route('/login', methods=['POST'])
def loginUser():
    return auth.authUser()

# If the token is close to expiration and the user is still using the app, revalidate it
@routes.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refreshToken():
    return auth.refresh()

# Boolean to check whether the current user is authenticated or not
@routes.route('/hasAuth', methods=['GET'])
@jwt_required
def checkAuth():
    print('auth? ', request.headers.get('Authorization'))
    token = request.headers.get('Authorization')
    current_user = get_jwt_identity()
    print('<<< ', current_user)
    return jsonify(logged_in_as=current_user), 200

# Revoke accessToken and put insert it into the blacklist
@routes.route('/logoutAccessToken', methods=['DELETE'])
@jwt_required
def logoutAccessToken():
    print('getting here')
    return auth.logout()

# Revoke refreshToken and put insert it into the blacklist
@routes.route('/logoutRefreshToken', methods=['DELETE'])
@jwt_refresh_token_required
def logoutRefreshToken():
    return auth.logout()
###

@routes.route('/hello', methods=['GET'])
@jwt_required
def hello():
  return 'hello'



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
        return user.getUser()
    if request.method == 'PUT':
        return user.updateUser()

@routes.route('/changeEmail', methods = ['PUT'])
def changeEmail():
    return user.changeEmail()

@routes.route('/changePassword', methods = ['PUT'])
def changePassword():
    return user.changePassword()
###

### Job

# Get, create, update, delete a single job
'''
@routes.route('/job', methods = ['POST', 'GET', 'PUT', 'DELETE'])
def jobControl():
    if request.method == 'POST':
        job.createJob()
    if request.method == 'GET':
        job.getJob()
    if request.method == 'PUT':
        job.updateJob()
    if request.method == 'DELETE':
        job.deleteJob()
'''        
###

### Queue

# Get, create, update the entire job queue
@routes.route('/queue', methods = ['POST', 'GET', 'PUT', 'DELETE'])
def updateUser():
    if request.method == 'POST':
        return queue.createJob()
    if request.method == 'GET':
        return queue.getJob()
    if request.method == 'PUT':
        return queue.updateJob()
    if request.method == 'DELETE':
        return queue.deleteJob()
###


