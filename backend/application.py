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
from backConfig import BaseConfig
from flask_jwt_extended import JWTManager
from flask_mail import Mail

# Extend JSON Encoder to make sure it works with ObjectIds
class JSONEncoder(json.JSONEncoder):
  def default(self, o):
    if isinstance(o, ObjectId):
      return str(o)
    if isinstance(o, datetime.datetime):
      return str(o)
    return json.JSONEncoder.default(self, o)

# flask mongoengine
mongo = PyMongo()

# flask bcrypt hashing
flask_bcrypt = Bcrypt()

# flask JSON web token manager
jwt = JWTManager()

# flask mail manager
mail = Mail()

# Create the app and import everything, execute the function in run.py, 
# in order to avoid circular dependencies and in order to gain availability in all other files
def create_app():
    app = Flask(__name__, static_folder='../frontend/deepio/public/dist', template_folder='../frontend/deepio/public/')
    app.config.from_object(BaseConfig)

    # flask mongoengine init
    mongo.init_app(app)
    # JSON web token init
    jwt.init_app(app)
    # Bcrypt hashing init
    flask_bcrypt.init_app(app)
    # Mail client init
    mail.init_app(app)
    # Cross origin init
    CORS(app)
    # Extened JSONEncoder init
    app.json_encoder = JSONEncoder
    
    jwt._set_error_handler_callbacks(app)
    
    # import blueprints
    from routes import routes

    # register blueprints
    app.register_blueprint(routes)

    return app
