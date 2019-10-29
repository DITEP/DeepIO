from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError
from bson import ObjectId

prediction_schema = {
    "type": "object",
    "properties": {
        "predictionTitle": {
            "type": "string"
        },
        "submittedBy": {
            "type": "string",
            "format": "email"
        },
        "storedAt": {
            "type": "string",
        },
        "vectors": { 
          "type": "array",
          "items": {
            "type" : "object",
            "properties" : {
              "vector" : {                           
                  "type" : "string"
              }
            }
          }        
        },
        "result": {
          "type": "string"
        },
        "timeStarted": {
          "type": "string" 
        },
        "timeEnded": { 
          "type": "string" 
        }
    },
    "required": ["predictionTitle", "submittedBy", "storedAt"],
    "additionalProperties": False
}

def validate_prediction(data):
    try:
        validate(data, prediction_schema)
    except ValidationError as e:
        return {'ok': False, 'message': e}
    except SchemaError as e:
        return {'ok': False, 'message': e}
    return {'ok': True, 'data': data}