# -*- coding: utf-8 -*-
from application import create_app
from prediction_engine import start_prediction_engine

# start prediction engine
start_prediction_engine()

# start the app
app = create_app()
app.run(host="0.0.0.0", port=8002, use_reloader=False)
