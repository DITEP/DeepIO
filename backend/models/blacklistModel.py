blacklist_schema = {
    "type": "object",
    "properties": {
        "expiredToken": {
            "type": "string",
        },
        "createdAt": new Date()
    },
    "required": ["expiredToken", "createdAt"],
    "additionalProperties": False
}
