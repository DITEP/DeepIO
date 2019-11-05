from flask import request, jsonify
from application import mongo
from bson import json_util, ObjectId
from werkzeug import secure_filename

import os
import controllers.errors

def uploadFile():
  uploadFolder = './frontend/public/uploads'
  file = request.files['file']
  if file:
    filename = secure_filename(file.filename)
    file.save(os.path.join(uploadFolder, filename))
    return jsonify({'ok': True, 'message': 'File upload was successful!'}), 200
  else:
      return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400