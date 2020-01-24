#!/bin/bash

source .env
JSON='{"BACKEND_PORT": '"$BACKEND_PORT"',"FRONTEND_PORT": '"$FRONTEND_PORT"', "DOMAIN": "'"$DOMAIN"'"}'

echo $JSON > frontend/var_env.json
