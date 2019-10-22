# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, url_for, session, flash, redirect, jsonify
import os
from flask_pymongo import PyMongo
import json
from bson.objectid import ObjectId
import datetime
import threading
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (JWTManager, create_access_token, create_refresh_token,
                                jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

from models.userModel import validate_user
from config import BaseConfig
from routes import routes

# Extend JSON Encoder to make sure it works with ObjectIds
class JSONEncoder(json.JSONEncoder):
  def default(self, o):
    if isinstance(o, ObjectId):
      return str(o)
    if isinstance(o, datetime.datetime):
      return str(o)
    return json.JSONEncoder.default(self, o)

app = Flask(__name__, static_folder='../frontend/deepio/public/dist', template_folder='../frontend/deepio/public/')
CORS(app)
flask_bcrypt = Bcrypt(app)
app.config.from_object(BaseConfig)
app.register_blueprint(routes)
mongo = PyMongo(app)
app.json_encoder = JSONEncoder
jwt = JWTManager(app)

@app.route('/', methods=['GET','POST'])
def index():
  return render_template("index.html")

@app.route('/hello', methods=['GET'])
@jwt_required
def hello():
  return 'hello'

# Try to find the current token in the list of blacklisted tokens in the database
@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    tokenFound = mongo.db.blacklist.find_one({'expiredToken': jti})
    if tokenFound:
        return True
    return False

if __name__ == '__main__':
    app.secret_key = os.urandom(24)
    app.run(host="0.0.0.0", port=8000)