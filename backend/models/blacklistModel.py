# Only used for bookkeeping purposes
# Contains an old token and a timestamp
# On logout or token expiration time, add token to blacklist
# After createdAt timestamp + 24 hours, delete from database
blacklist_schema = {
    "type": "object",
    "properties": {
        "createdAt": {
            "type": "string",
        },
        "expiredToken": {
            "type": "string",
        },
    },
    "required": ["expiredToken", "createdAt"],
    "additionalProperties": False
}
