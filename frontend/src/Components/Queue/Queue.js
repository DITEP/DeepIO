import React from "react";
import {withRouter} from 'react-router';
import './Queue.css';
import APIClient from '../../Actions/apiClient';

import Table from 'react-bootstrap/Table';

import i18n from "i18next";
import { withTranslation } from 'react-i18next';

import moment from 'moment';

class Queue extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      userMail: '',
      queue: [],
      searchField: '',
      isFetchingData: true,
      entriesExist: false,
      authDeletionError: false
    }
    this.createItems = this.createItems.bind(this);
    this.deleteQueueItem = this.deleteQueueItem.bind(this);
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
      })
      .then((data) =>
      this.apiClient.getQueue().then((data) => {
        this.setState({
          queue: data,
          isFetchingData: false,
        });
        if(data.length) {
          this.setState({
            entriesExist: true,
          });
        }
      }).catch((err) => {})
    ).catch((err) => {
        if (err.response.status) {
          if (err.response.status === 401) {        
            const location = {
              pathname: '/login',
              state: { 
                from: 'Queue', 
       					message: i18n.t('messages.notauthorized') 
              }
            }      
            this.props.history.push(location)
          }
        }
      })
  }

  // Select whole table and row of item that is going to get deleted from DOM
  // Delete the selected queue entry from the database, 
  // Return ID of user who submitted the item (must obviously be the one whose deleting) as well as the ID of the prediction
  // Pull the prediction ID from the users history
  // Return the ID of the prediction
  // Remove prediction from collection with ID
  // Return link to file associated with prediction
  // Delete the file from the server
  deleteQueueItem(event) {
    this.setState({
      authDeletionError: false
    })
  
    let queueID = event.target.parentNode.parentNode.id;
    let table = event.target.parentNode.parentNode.parentNode;
    let tableRow = event.target.parentNode.parentNode

    this.apiClient.deleteQueueItem({'queueID': queueID}).then((data) => {
      this.apiClient.removeFromUserHistory(data).then((res) => {
        this.apiClient.deletePrediction(res.data).then((res) => {
          this.apiClient.deleteFile(res.data).then((data) => {              
            table.removeChild(tableRow);
          }).catch((err) => { console.log('Error when deleting the file from the server ', err) })
        }).catch((err) => { console.log('Error deleting the prediction ', err) })
      }).catch((err) => { console.log('Error deleting the prediction from the users history ', err) })
    }).catch((err) => { this.setState({authDeletionError: true}) })
  }
  
  // Map array of queue data to HTML items
  // There wzas a problem with the timestamp and daylight savings (The time was off by one hour)
  // Hence, the format function in the beginning, as well as momentJS to fix the issue
  // Print creator name, prediction name, when the prediction started and for how long it has been running 
  // Check whether the user is also the creator of an item; if so, also show a delete icon
  createItems(item) {
    function format(time) {
      // Hours, minutes and seconds
      var hrs = ~~(time / 3600);
      var mins = ~~((time % 3600) / 60);
      var secs = ~~time % 60;

      // Output like "1:01" or "4:03:59" or "123:03:59"
      var ret = "";
      if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
      }
      ret += "" + mins + ":" + (secs < 10 ? "0" : "");
      ret += "" + secs;
      return ret;
    }
    
    let startTime = new Date(item.prediction.timeStarted.$date);
    let startedAt = moment.utc(startTime)
    let currentTime = moment.utc(new Date())
    let difference = currentTime.diff(startedAt, 'seconds')
    let timeRunning = format(difference);
    var isOwner = false;
    
    if (this.state.userMail === item.user.email) {
      isOwner = true;
    }
    
    return (
      <tr key={item._id.$oid} id={item._id.$oid}>
        <td> {item.prediction.predictionTitle} </td> 
        <td> {item.user.name} </td>
        <td> {startTime.toLocaleTimeString() + ' ' + startTime.toLocaleDateString()} </td>
        <td> {timeRunning} </td>
        <td> <span className={'remove-file ' + (isOwner ? '' : 'hidden')} onClick={this.deleteQueueItem}></span> </td> 
      </tr>
    )
  }

  render() {
    const { t } = this.props;
  
    if (!this.state.isFetchingData) {
      var queueEntries = this.state.queue;
      queueEntries = queueEntries.reverse();
      var listItems = queueEntries.map(this.createItems);
    }
    return (
      <div className="container">
        <div className="container-fluid">

          <p className={'login-error ' + (this.state.authDeletionError ? '' : 'hidden')}>
            {t('queue.authdeletionerror')} 
          </p>

          <Table striped bordered hover className={"queue-table " + (this.state.entriesExist ? '' : 'hidden')}>
            <thead>
              <tr>
                <th>{t('queue.tabletitle')}</th>
                <th>{t('queue.tablename')}</th>
                <th>{t('queue.tablestarted')}</th>
                <th>{t('queue.tableruntime')}</th>
                <th>{t('queue.tableedit')}</th>
              </tr>
            </thead>
            <tbody>
              {listItems}
            </tbody>
          </Table>
          <p className={"queue-table " + (this.state.entriesExist ? 'hidden' : '')}>{t('queue.queueempty')}</p>
        </div>
      </div>
    )
  }
}
export default withRouter(withTranslation()(Queue));