# DeepIO

Estimate patients' outcome from cancer RNAseq using DL model trained with transfer learning.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

```
Docker deamon up and running
Docker Compose
```

### Configuration

#### Connection settings

The file .env holds all of the configurations of the server. Edit it to adjust the different settings.
The DOMAIN variable is the adress of the machine that will host the server.
The JWT variable is the secret token.

#### Models

Add your models (.h5 et .RData) to ```DeepIO/backend/prediction_deamon/ML_models/```.

### Installing

```
./start_server.sh
```

If the Docker deamon was started with sudo, run: 

```
sudo ./start_server.sh
```

To use the app, open your web browser and go the following (replace the content between brackets by the values in DeepIO/.env):

```
http://[DOMAIN]:[FRONTEND_PORT]
```


## Built With
* [NodeJS](https://nodejs.org)
* [React](https://reactjs.org)
* [plotly](https://plot.ly)
* [Keras](https://keras.io)
* [MongoDB](https://www.mongodb.com)
* [Docker](https://www.docker.com)
