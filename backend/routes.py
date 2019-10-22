from flask import Blueprint
from flask_jwt_extended import (jwt_required, jwt_refresh_token_required)

import controllers.auth as auth
import controllers.user as user
#import controllers.job as job
import controllers.queue as queue

routes = Blueprint('routes', __name__)

### Authentication
# Check user, create token, redirect

@routes.route('/login', methods=['POST'])
def loginUser():
    auth.authUser()

# If the token is close to expiration and the user is still using the app, revalidate it
@routes.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refreshToken():
    auth.refresh()

# Revoke accessToken and put insert it into the blacklist
@routes.route('/logout', methods=['DELETE'])
@jwt_required
def logoutAccessToken():
    auth.logout()

# Revoke refreshToken and put insert it into the blacklist
@routes.route('/logout2', methods=['DELETE'])
@jwt_refresh_token_required
def logoutRefreshToken():
    auth.logout()
###

### User

# Get, create, update a single user
@routes.route('/user', methods = ['POST', 'GET', 'PUT'])
def userControl():
    if request.method == 'POST':
        user.createUser()
    if request.method == 'GET':
        user.getUser()
    if request.method == 'PUT':
        user.updateUser()

@routes.route('/changeEmail', methods = ['PUT'])
def changeEmail():
    user.changeEmail()

@routes.route('/changePassword', methods = ['PUT'])
def changePassword():
    user.changePassword()
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
        queue.createJob()
    if request.method == 'GET':
        queue.getJob()
    if request.method == 'PUT':
        queue.updateJob()
    if request.method == 'DELETE':
        queue.deleteJob()
###
