import multiprocessing
import time


def engine_loop():
  count = 0
  while True:
    print('engine says hi for the', count, 'th time')
    count += 1
    time.sleep(5)


def start_prediction_engine():
    proc = multiprocessing.Process(target=engine_loop, args=(), daemon=True)
    proc.start()
    print('# Prediction engine started with PID: ' + str(proc.pid))
