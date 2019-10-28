#!/bin/bash

mkdir backend/venv

{ # try

    python3 -m venv backend/venv

} || { # catch
    python3 -m venv --without-pip backend/venv
    source backend/venv/bin/activate
    curl https://bootstrap.pypa.io/get-pip.py | python
    deactivate
}

activate

pip install -r install.txt

cd frontend
npm install
cd ..
