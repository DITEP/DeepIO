from flask_bcrypt import Bcrypt

# Try to find email address in database. If it is unique, make new user. Otherwise send error message
def createUser():
    data = validate_user(request.get_json())
    if data['ok']:
      data = data['data']
      userExists = mongo.db.users.find_one({'email': data['email']})
      if not userExists:
        data['password'] = flask_bcrypt.generate_password_hash(
          data['password'])
        result = mongo.db.users.insert_one(data)
        return jsonify({'ok': True, 'message': 'User created successfully!'}), 200
      else:
        return jsonify({'ok': False, 'message': 'User exists parameters!'}), 409
      return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400

def getUser():
    query = request.args
    data = mongo.db.users.find_one({'email': query['email']})
    if data:
      return jsonify(data), 200
    return jsonify({'ok': False, 'message': 'No user!'}), 400

def updateUser():
    return

def changePassword():
    data = validate_user(request.get_json())
    if data['ok']:
      data = data['data']
      data['password'] = flask_bcrypt.generate_password_hash(data['password'])
      currentUser = mongo.users.update_one({'email': data['email']}, {'$set': {'passworf': data['password']}}, upsert=False)
      return jsonify({'ok': True, 'message': 'Email updated successfully!'}), 200
    return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400

def changeEmail():
    data = validate_user(request.get_json())
    if data['ok']:
      data = data['data']
      userExists = mongo.db.users.find_one({'email': data['newEmail']})
      if not userExists:
        currentUser = mongo.db.users.update_one({'email': data['email']}, {'$set': {'email': data['newEmail']}}, upsert=False)
        return jsonify({'ok': True, 'message': 'Email updated successfully!'}), 200
      else:
        return jsonify({'ok': False, 'message': 'User exists parameters!'}), 409
    return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400
