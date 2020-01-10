# -*- coding: utf-8 -*-
from application import create_app

import sys
sys.path.insert(1, './backend/prediction_deamon')
from prediction_deamon import start_prediction_deamon

start_prediction_deamon()

# start the app
app = create_app()
app.run(host="0.0.0.0", port=8002, use_reloader=False)
