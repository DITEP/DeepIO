import datetime

class BaseConfig(object):
    # Database
    MONGO_URI = "mongodb://localhost:27017/deepio"
    
    # Token Authentication
    JWT_SECRET_KEY = 'SOOO_SECRET'
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(minutes=1)
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ['access']
    
    # Development vs production environment
    DEBUG = True
