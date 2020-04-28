# DeepIO

Estimate patient's outcome from cancer RNAseq using deep learning models trained with transfer learning.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

* Docker deamon up and running
* Docker Compose

### Configuration

#### Connection settings

The file *DeepIO/.env* holds all of the configurations of the server. Edit it to adjust the different settings.
The **DOMAIN** variable is the address of the machine that will host the server.
The **JWT** variable is the secret token.

#### Models

Add your models (.h5 et .RData) to *DeepIO/backend/prediction_deamon/ML_models/*.

### Installing

To launch the server, simply type:

```
./start_server.sh
```

If the Docker deamon was started with sudo, run: 

```
sudo ./start_server.sh
```

To use the application, open your web browser and go to the following adress (replace the content between brackets by the values in *DeepIO/.env*):

```
http://[DOMAIN]:[FRONTEND_PORT]
```

### Data storage

All the data gathered and created by the application are stored in the directory *DeepIO/app_memory* at the root of the application. The uploaded files and the MongoDB database will be stored in it.
It means that you can use this folder to export your data or use data from another instance of the application.


## Troubleshoot

### Old CPUs compatibility (Illegal instruction / core dumped)

Most recent versions of Tensorflow use CPU instructions that some old CPUs does not have. This can result in error when starting the server (in the backend part). To solve this issue, edit the *DeepIO/backend/venv_requirement.txt* file by replacing the lines:

```
Keras==2.3.1
tensorflow==1.14.0
```

by:

```
Keras==2.2.0
tensorflow==1.5.0
```

## Built With
* [NodeJS](https://nodejs.org)
* [React](https://reactjs.org)
* [plotly](https://plot.ly)
* [Keras](https://keras.io)
* [MongoDB](https://www.mongodb.com)
* [Docker](https://www.docker.com)
