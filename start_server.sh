#!/bin/bash

intexit() {
    # Kill all subprocesses (all processes in the current process group)
    kill -HUP -$$
}

hupexit() {
    # HUP'd (probably by intexit)
    echo
    echo "Interrupted"
    exit
}

trap hupexit HUP
trap intexit INT

cd frontend
npm run build
cd ..
source backend/venv/bin/activate 
python3 backend/run.py &
cd frontend/
npm start

wait
