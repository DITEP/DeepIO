from flask import request, jsonify
from application import jwt

# Return various error depending on what type of token error occured

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
        
@jwt.user_loader_error_loader
def handle_user_loader_error():
    return jsonify({
        'status': 422,
        'sub_status': 42,
        'msg': 'User loader failed'
    }), 401
    
@jwt.claims_verification_failed_loader
def handle_verification_failed_error():
    return jsonify({
        'status': 422,
        'sub_status': 42,
        'msg': 'Verification failed'
    }), 401