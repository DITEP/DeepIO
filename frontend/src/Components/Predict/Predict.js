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
      dropBoxIsHidden: false,
      fileIsHidden: true,
      file: {},
      fileName: '',
      uploadProgress: 0,
      successfulUpload: false,
      uploading: false,
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
  }

  async componentDidMount() {
    this.apiClient = new APIClient();
    
    this.apiClient.getAuth().then((data) =>
      console.log(data)
    ).catch((err) => {
      if (err.response.status) {          
        const location = {
          pathname: '/login',
          state: { from: 'Predict', message: i18n.t('messages.notauthorized')}
        }
    
        this.props.history.push(location)
      }
    })
  }
  
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
  
  uploadFiles(file) {
    return new Promise((resolve, reject) => {
  
      this.setState({ uploadProgress: {}, uploading: true });
      var file = this.state.files[0];
      var self = this;
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
      this.setState({ successfulUpload: true, uploading: false });
    })
  }
  
  removeFile() {
    this.setState({
      fileIsHidden: true,
      dropBoxIsHidden: false,
      file: {}
    });
  }
  
  startPrediction() {
    if (this.state.successfulUpload) {
      /* ... */
    }
  }


	render () {
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
                  type="email" 
                  placeholder={t('prediction.titleplaceholder')}
                  name='email' 
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