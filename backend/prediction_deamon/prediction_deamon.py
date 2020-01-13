import multiprocessing
import time
from pymongo import MongoClient
import pymongo
from bson import ObjectId
import numpy as np
import pandas as pd
import pprint
from os import listdir
from os.path import isfile, join
from bson.binary import Binary
import pickle
import datetime
import sys
sys.path.insert(1, './backend')
from prediction_engine import Prediction_Engine
import json

f = open('./backend/prediction_deamon/genes_of_treatment_to_test.txt', 'r')
treatments_to_try = f.read().splitlines()
f.close()

df = pd.read_csv('./backend/prediction_deamon/X_columns.csv')
genes_index = df['x'].tolist()
    

def get_oldest_pred_in_queue(db):
  cursor = db.queue.find({})
  
  oldest_date = None
  oldest_pred_id = None
  
  for document in cursor:
    
    pred_id =  document['predictionID']
    pred = db.predictions.find_one({'_id': ObjectId(pred_id)})
        
    if pred['storedAt'].split('.')[-1] == 'npy':
      time_started = pred['timeStarted']
      if oldest_date is None:
        oldest_date = time_started
        oldest_pred_id = pred_id
      else:
        if oldest_date > time_started:
          oldest_date = time_started
          oldest_pred_id = pred_id
    
  return oldest_pred_id


def get_pred_data(db, pred_id):
  pred = db.predictions.find_one({'_id': ObjectId(pred_id)})
  pred_file_name = pred['storedAt']
  file_path = './frontend/public/uploads/' + pred_file_name
  data = np.load(file_path)
  return data


def make_json(result): 
  d = {}
  patient_id = 0
  for patient in result:
    d[patient_id] = patient.tolist()
    patient_id += 1
  
  return json.dumps(d)
  


def put_data_in_db(db, id_pred, result):
  #jsonified_results = make_json(result)
  db.predictions.update_one({'_id': ObjectId(id_pred)},{'$set': {
                             'result': result,
                             'timeEnded': datetime.datetime.utcnow()}}, upsert=False)
  
  
def remove_from_queue(db, pred_id):
  queue_ticket = db.queue.find_one({'predictionID': ObjectId(pred_id)})
  db.queue.delete_one({'_id': ObjectId(queue_ticket['_id'])})
  

def pred_with_treatement(pred_engine, pred_data):
  simulation_result = {}
  simulation_result['NO'] = pred_engine.predict(pred_data)

  for treatment in treatments_to_try:
    gene_index = genes_index.index(treatment)   
    X_treatment = np.copy(pred_data)
    X_treatment[:, gene_index] = 0
    simulation_result[treatment] = pred_engine.predict(X_treatment)
    
  # make it JSON
  results = []
  for i in range(len(pred_data)):
    patient_pred = {}
    patient_pred['patient_id'] = 'patient_'+str(i)
    for treatment in simulation_result.keys():
      patient_pred[treatment] = simulation_result[treatment][i].tolist()
    results.append(patient_pred)
  
  return results
  


def deamon_loop():
  # connect to the local database
  connection = MongoClient('localhost', 27017)
  db = connection['deepio']
  db.authenticate('deepIoAdmin', '2019Roussy')
  
  pred_engine = Prediction_Engine(14)

  while True:
    if db.queue.count() > 0:
      # get the oldest prediction
      id_oldest_pred = get_oldest_pred_in_queue(db)
      
      if id_oldest_pred is not None:
        # get the data of the oldest prediction
        pred_data = get_pred_data(db, id_oldest_pred)

        # run the prediction
        #pred_result = pred_engine.predict(pred_data)
        pred_result = pred_with_treatement(pred_engine, pred_data)


        # put the results in the database
        put_data_in_db(db, id_oldest_pred, pred_result)
        
        # remove the request from the queue
        remove_from_queue(db, id_oldest_pred)
      
    
    time.sleep(5)


def start_prediction_deamon():
    proc = multiprocessing.Process(target=deamon_loop, args=(), daemon=True)
    proc.start()
    print('# Prediction engine started with PID: ' + str(proc.pid))
    print(treatments_to_try)
