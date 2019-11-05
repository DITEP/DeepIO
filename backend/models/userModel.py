from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

# Users have a password, email, name (only for display puposes) and a history
# History is an array of prediciton IDs that have been submitted by the user
# Can be seen in the user profile 
user_schema = {
    "type": "object",
    "properties": {
        "email": {
            "type": "string",
            "format": "email"
        },
        "name": {
            "type": "string"
        },
        "password": {
            "type": "string",
            "minLength": 5
        },
        "history": {
          "type": "array",
          "items": {
            "type" : "object",
            "properties" : {
              "jobID" : {                           
                  "type" : "string"
              }
            }
          }
        }
    },
    "required": ["email", "password"],
    "additionalProperties": False
}

# When data is going to be stored, try the data against the model to make sure it has the right format of required items
def validate_user(data):
    try:
        validate(data, user_schema)
    except ValidationError as e:
        return {'ok': False, 'message': e}
    except SchemaError as e:
        return {'ok': False, 'message': e}
    return {'ok': True, 'data': data}