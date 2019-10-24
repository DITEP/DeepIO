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
