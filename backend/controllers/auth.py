from flask import request, jsonify
from application import mongo
from application import flask_bcrypt
from models.userModel import validate_user
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                get_jwt_identity, get_raw_jwt)

from application import jwt
                              
# Try to find user in DB, check password against hash, generate tokens or send back error message
def authUser():
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


def checkAuth():
  return True

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
    try:
        mongo.db.blacklist.insert_one({'expiredToken' : jti})
        return jsonify({"msg": "Successfully logged out"}), 200
    except:
        return jsonify({'ok': False, 'message': 'Something went wrong'}), 500

# Endpoint for revoking the current users refresh token
def logout2():
    jti = get_raw_jwt()['jti']    
    try:
        mongo.db.blacklist.insert_one({'expiredToken' : jti})
        return jsonify({"msg": "Successfully logged out"}), 200
    except:
        return jsonify({'ok': False, 'message': 'Something went wrong'}), 500

def checkIfTokenInBlackList(decrypted_token):
    jti = decrypted_token['jti']
    token = mongo.db.blacklist.find_one({'expiredToken': jti})
    if token:
      return True
    return False

@jwt.expired_token_loader
def my_expired_token_callback():
    return jsonify({
        'status': 422,
        'sub_status': 42,
        'msg': 'The token has expired'
    }), 401

@jwt.invalid_token_loader
def handle_invalid_header_error(e):
    return jsonify({
        'status': 422,
        'sub_status': 42,
        'msg': 'The token has expired'
    }), 401

@jwt.token_in_blacklist_loader
def handle_revoked_token_error(e):
    return jsonify({
        'status': 422,
        'sub_status': 42,
        'msg': 'The token has expired'
    }), 401
  
@jwt.revoked_token_loader
def handle_revoked_token_error(e):
    return jsonify({
        'status': 422,
        'sub_status': 42,
        'msg': 'The token has expired'
    }), 401