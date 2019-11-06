from flask import request, jsonify
from application import mongo
from bson import json_util, ObjectId
from werkzeug import secure_filename

import os
import controllers.errors

# Store selected file in the frontend public folder for now, needs to be changed to some ODIN route later on
def uploadFile():
  uploadFolder = './frontend/public/uploads'
  file = request.files['file']
  if file:
    filename = secure_filename(file.filename)
    file.save(os.path.join(uploadFolder, filename))
    return jsonify({'ok': True, 'message': 'File upload was successful!'}), 200
  else:
      return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400
      
# Find a file in the public folder by name and remove it
def deleteFile():
  uploadFolder = './frontend/public/uploads'
  data = request.get_json()
  filename = data['filename']
  if filename:
    filename = secure_filename(filename)
    os.remove(os.path.join(uploadFolder, filename))
    return jsonify({'ok': True, 'message': 'File was successfully deleted!'}), 200
  else:
      return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400