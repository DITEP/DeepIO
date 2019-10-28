predict_schema = {
    "type": "object",
    "properties": {
        "jobName": {
            "type": "String"
        },
        "submittedBy" {
            "type": "ObjectId"
        },
        "storedAt": {
            "type": "string",
        },
        "vector": [
            {
                "type": "NumberDecimal",
            }
        ],
        "result": {
            "type": {"NumberDecimal"}
        },
        "timeStarted": "String",
        "timeEnded": { "String" }
    },
    "additionalProperties": False
}