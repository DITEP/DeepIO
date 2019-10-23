from flask import request, jsonify
from application import jwt

@jwt.expired_token_loader
def my_expired_token_callback():
    return jsonify({
        'status': 422,
        'sub_status': 42,
        'msg': 'The token has expired'
    }), 401

@jwt.invalid_token_loader
def handle_invalid_header_error():
    return jsonify({
        'status': 422,
        'sub_status': 42,
        'msg': 'The token is invalid'
    }), 401

@jwt.token_in_blacklist_loader
def handle_revoked_token_error():
    return jsonify({
        'status': 422,
        'sub_status': 42,
        'msg': 'The token is blacklisted'
    }), 401
  
@jwt.revoked_token_loader
def handle_revoked_token_error():
    return jsonify({
        'status': 422,
        'sub_status': 42,
        'msg': 'The token has been revoked'
    }), 401