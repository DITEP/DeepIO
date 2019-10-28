from flask import request, jsonify
from application import mongo
from application import flask_bcrypt
from models.userModel import validate_user
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                get_jwt_identity, get_raw_jwt)
import controllers.errors
from datetime import datetime

# Try to find user in DB, check password against hash, generate tokens or send back error message
def authUser():
  data = validate_user(request.get_json())
  print(data)
  if data['ok']:
    data = data['data']
    user = mongo.db.users.find_one({'email': data['email']})
    
    if user and flask_bcrypt.check_password_hash(user['password'], data['password']):
      del user['password']
      access_token = create_access_token(identity=data)
      user['token'] = access_token
      return jsonify({'ok': True, 'data': user}), 200
    else:
      return jsonify({'ok': False, 'message': 'invalid username or password'}), 401
  else:
    return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400

# If the user is still using the app and the token is close to expiration date, revalidate the user
def refresh():
    current_user = get_jwt_identity()
    ret = {
            'token': create_access_token(identity=current_user)
    }
    return jsonify({'ok': True, 'data': ret}), 200

# Endpoint for revoking the current users access token
def logout():
    jti = get_raw_jwt()['jti']
    token = {}
    token['expiredToken'] = jti
    token['createdAt'] = datetime.utcnow()
    try:
        mongo.db.blacklist.insert_one(token)
        return jsonify({"msg": "Successfully logged out"}), 200
    except:
        return jsonify({'ok': False, 'message': 'Something went wrong'}), 500

def checkIfTokenInBlackList(decrypted_token):
    jti = decrypted_token['jti']
    token = mongo.db.blacklist.find_one({'expiredToken': jti})
    if token:
      return True
    return False