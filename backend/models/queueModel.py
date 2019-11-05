from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError
from bson import ObjectId

# A queue item has the ID of the user who created the prediction,
# The ID of the prediction this element is referring to
# Can pull all other relevant informationfrom these infos
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

# When data is going to be stored, try the data against the model to make sure it has the right format of required items
def validate_queue(data):
    try:
        validate(data, queue_schema)
    except ValidationError as e:
        return {'ok': False, 'message': e}
    except SchemaError as e:
        return {'ok': False, 'message': e}
    return {'ok': True, 'data': data}