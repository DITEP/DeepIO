mongo --eval "db.getSiblingDB('$DATABASE_NAME').createUser({user: '$MONGO_USERNAME', pwd: '$MONGO_PASSWORD', roles: ['readWrite']})"
mongo --eval "db.getSiblingDB('$DATABASE_NAME').blacklist.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 86400 } )"
