import React from "react";
import {withRouter} from 'react-router';
import './Queue.css';
import APIClient from '../../Actions/apiClient';

import i18n from "i18next";

class Queue extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      queue: []
    }
  }

  async componentDidMount() {
    this.apiClient = new APIClient();

    this.apiClient.getAuth().then((data) =>
      console.log(data)
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

    /*this.apiClient.getQueue().then((data) =>
      this.setState({
        queue: data
      })
    ).catch((err) => {
        if (err.response.status === 401) {
          return this.props.history.push('/login');
        }
      })*/
    }

  createItems(item) {
    return (
      <li key={item._id}>
        <p className="queue-item">{item.text}</p>
        <span id={item.key} className="oi oi-x remove-step-icon" onClick={this.deleteItem}></span>
      </li>
    )
  }

  render() {
    var queueEntries = this.state.queue;
    var listItems = queueEntries.map(this.createItems);
    return (
      <div className="container">
        <div className="container-fluid">
          <ul className="queue-list">
              {listItems}
          </ul>
        </div>
      </div>
    )
  }
}
export default withRouter(Queue);