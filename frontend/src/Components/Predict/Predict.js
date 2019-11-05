import React from "react";
import {withRouter} from 'react-router';
import './Predict.css';
import APIClient from '../../Actions/apiClient';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropzone from 'react-dropzone';

import { withTranslation } from 'react-i18next';
import i18n from "i18next";

class Predict extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      userMail: '',
      predictionTitle: '',
      dropBoxIsHidden: false,
      fileIsHidden: true,
      file: {},
      fileName: '',
      uploadProgress: 0,
      successfulUpload: false,
      uploading: false,
      fileError: false,
      titleError: false,
      otherError: false
    }
    this.onDrop = (files) => {
      this.setState({file: files[0]});
      this.setState({
        dropBoxIsHidden:true,
        fileIsHidden: false 
      });
      console.log(this.state.file);
      //this.uploadFiles(files[files.length-1]);
    };

    this.sendRequest = this.sendRequest.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.startPrediction = this.startPrediction.bind(this);
    this.resetIndicators = this.resetIndicators.bind(this);
    this.isEmpty = this.isEmpty.bind(this);
  }

  // Check the users auth token,
  // If there is none / it is blacklisted,
  // Push user to login, set message banner to appropriate message,
  // Store current location to redirect user back here after successful login
  async componentDidMount() {
    this.apiClient = new APIClient();
    
    this.apiClient.getAuth().then((data) => {
      this.setState({
        userMail: data.logged_in_as.email
      })
    }).catch((err) => {
  		if (err.response.status) {
        if (err.response.status === 401) {
    			const location = { 
    				pathname: '/login', 
    				state: { 
    					from: 'Predict', 
    					message: i18n.t('messages.notauthorized') 
    				} 
    			} 
    			this.props.history.push(location) 
   		  }
      } 
    })
  }
  
  // Start uploading file, set state o pending,
  // Calculate progress and update percentage bar,
  // Post to server
  // Not done! Percentage bar is missing, upload isn't checked
  sendRequest(file) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
  
      req.upload.addEventListener("progress", event => {
        if (event.lengthComputable) {
          var currentProgess = {
            state: "pending",
            percentage: (event.loaded / event.total) * 100
          };
          this.setState({ uploadProgress: currentProgess });
        }
      });
     
      req.upload.addEventListener("load", event => {
        var currentProgess = { state: "done", percentage: 100 };
        this.setState({ uploadProgress: currentProgess });
        resolve(req.response);
      });
     
      req.upload.addEventListener("error", event => {
        var currentProgess = { state: "error", percentage: 0 };
        this.setState({ uploadProgress: currentProgess });
        reject(req.response);
      });
  
      var formData = new FormData();
      formData.append('image', file);
  
      req.open("POST", '/upload'); //TODO
      req.send(formData);
    });
  }
  
  // File is an object, object emptiness can not be checked in an easier way really
  isEmpty(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return JSON.stringify(obj) === JSON.stringify({});
  }
  
  // Not finished
  uploadFiles(file) {
    return new Promise((resolve, reject) => {
      this.setState({ 
        uploadProgress: {}, 
        uploading: true 
      });
      var file = this.state.files[0];
      var self = this; // If the below gets turned into an arrow function, saving the scope is probably not needed anymore
      this.sendRequest(file)
      .then(function() {
        self.setState({dropBoxIsHidden: 'hidden'})
        self.setState({fileIsHidden: ''});
        self.setState({ successfulUpload: true, uploading: false });
        self.setState({file: process.env.PUBLIC_URL + '/uploads/' + file.name}); // TODO
        self.setState({fileName: file.name});
      })
    })
    .catch(e => {
      // Not Production ready! Do some error handling here instead...
      this.setState({ 
        successfulUpload: true, 
        uploading: false 
      });
    })
  }
  
  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }  
  
  removeFile() {
    this.setState({
      fileIsHidden: true,
      dropBoxIsHidden: false,
      file: {}
    });
  }
  
  startPrediction() {
    this.resetIndicators();

    if (this.isEmpty(this.state.file)) {
      this.setState({
        fileError: true
      })
      return;
    }

    if (!this.state.predictionTitle) {
      this.setState({
        titleError: true
      })
      return;
    }
    
    if (!this.state.userMail) {
      this.setState({
        otherError: true
      })
      return;
    }
    
    let prediction = {
      "submittedBy": this.state.userMail,
      "predictionTitle": this.state.predictionTitle,
      "storedAt": this.state.file.path
    }
    
    // Create a new prediction in the database, return the auto generated ID, 
    // Pass ID into next function to save it in the history of the creator,
    // Pass the creator ID and the prediction ID to the last function to create a new item in the queue
    this.apiClient.createPrediction(prediction).then((data) => {
      this.apiClient.updateUserHistory({"predictionID": data.data}).then((data) => {
        this.apiClient.createQueueItem(data.data).then((data) => {
   			  const location = { 
    				pathname: '/queue', 
    				state: { 
    					from: 'Predict', 
    					message: i18n.t('messages.newpredictionsuccess')
    				} 
    			} 
    			this.props.history.push(location) 
        }).catch((err) => { console.log('Something went wrong while creating the queue item') })
      }).catch((err) => { console.log('Something went wrong while updating the user') })
    }).catch((err) => { console.log('Something went wrong while creating a new prediction') })
  }

  resetIndicators() {
    this.setState ({
      fileError: false,
      titleError: false,
      otherError: false
    })
  }

	render () {
    // Translation item
    const { t } = this.props;
    return (
      <div className="container">
        <div className="container-fluid">
        
          <p className="dropzone-header">{t('prediction.header')}</p>
          
          <div className="new-prediction-form">
            <div className="input-left-side">
              <Dropzone onDrop={this.onDrop}>
                {({getRootProps, getInputProps}) => (
                  <section className={'container ' + (this.state.dropBoxIsHidden ? 'hidden' : '')}>
                    <div {...getRootProps({className: 'dropzone'})}>
                      <input {...getInputProps()} />
                      <p>{t('prediction.dropzonehelper')}</p>
                    </div>
                  </section>
                )}
              </Dropzone>
              <div className={'preview-file ' + (this.state.fileIsHidden ? 'hidden' : '')}>
                <p>{this.state.file.name}
                  <span className="remove-file" onClick={this.removeFile}></span>
                </p>
              </div>
            </div>
            <div className="input-right-side">
              <Form.Group controlId="formBasicFile">
                <Form.Control 
                  type="text" 
                  placeholder={t('prediction.titleplaceholder')}
                  name='predictionTitle' 
                  value={this.state.predictionTitle}
                  onChange={this.handleInputChange}
                  required
                />
                <Form.Text className="text-muted prediction-info">
                  {t('prediction.predictiontitlehelp')}
                </Form.Text>
                
              </Form.Group>
            </div>
          </div>
          <hr />
          
          <p className={'prediction-error ' + (this.state.fileError ? 'show' : 'hidden')}>
            {t('prediction.fileisempty')} 
          </p>                
          <p className={'prediction-error ' + (this.state.titleError ? 'show' : 'hidden')}>
            {t('prediction.titleisempty')}  
          </p>
          <p className={'prediction-error ' + (this.state.otherError ? 'show' : 'hidden')}>
            {t('prediction.othererror')}
          </p>
                
          <span className="text-muted prediction-info">{t('prediction.submitpredictioninfo')}</span>
          <br />
          <Button className={'btn btn-primary btn-prediction ' + (this.state.successfulUpload ? '' : 'disabled')} onClick={this.startPrediction}>
            {t('prediction.submitprediction')}
          </Button>
          
        </div>
      </div>
    )
  }
}
export default withRouter(withTranslation()(Predict));