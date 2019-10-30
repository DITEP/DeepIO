import React from "react";
import {withRouter} from 'react-router';
import './Queue.css';
import APIClient from '../../Actions/apiClient';

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

import i18n from "i18next";
import { withTranslation } from 'react-i18next';

class Queue extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      queue: [],
      searchField: '',
      isFetchingData: true
    }
  }

  async componentDidMount() {
    this.apiClient = new APIClient();

    this.apiClient.getAuth().then((data) =>
      this.apiClient.getQueue().then((data) => {
        this.setState({
          queue: data,
          isFetchingData: false,
        })
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

  createItems(item) {
    let startTime = new Date(item.prediction.timeStarted.$date);
    let date = new Date(); 
    let timestamp = date.getTime();
    let timeRunning = new Date(timestamp - startTime);
    
    return (
      <tr key={item._id.$oid}>
        <td> {item.prediction.predictionTitle} </td> 
        <td> {item.user.name} </td>
        <td> {startTime.toLocaleTimeString() + ' ' + startTime.toLocaleDateString()} </td>
        <td> {timeRunning.toLocaleTimeString()} </td> 
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

          <Table striped bordered hover className="queue-table">
            <thead>
              <tr>
                <th>{t('queue.tableTitle')}</th>
                <th>{t('queue.tableName')}</th>
                <th>{t('queue.tableStarted')}</th>
                <th>{t('queue.tableRuntime')}</th>
              </tr>
            </thead>
            <tbody>
              {listItems}
            </tbody>
          </Table>
          
        </div>
      </div>
    )
  }
}
export default withRouter(withTranslation()(Queue));