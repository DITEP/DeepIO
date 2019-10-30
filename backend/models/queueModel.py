from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError
from bson import ObjectId

queue_schema = {
    "type": "object",
    "properties": {
        "userID": {
            "type": "string"
        },
        "predictionID": {
            "type": "string"        
        }
    },
    "required": ["userID", "predictionID"],
    "additionalProperties": False
}

def validate_queue(data):
    try:
        validate(data, queue_schema)
    except ValidationError as e:
        return {'ok': False, 'message': e}
    except SchemaError as e:
        return {'ok': False, 'message': e}
    return {'ok': True, 'data': data}