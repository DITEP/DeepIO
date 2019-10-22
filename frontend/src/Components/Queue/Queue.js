import React from "react";
import './Queue.css';
import APIClient from '../../Actions/apiClient';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class Queue extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      queue: []
    }
  }

  async componentDidMount() {
    this.apiClient = new APIClient();

    this.apiClient.getQueue().then((data) =>
      this.setState({
        queue: data
      })
    ).catch((err) => {
        if (err.response.status === 401) {
          return this.props.history.push('/login');
        }
      })
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