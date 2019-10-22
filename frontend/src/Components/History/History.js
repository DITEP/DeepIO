import React from "react";
import './History.css';
import APIClient from '../../Actions/apiClient';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class History extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      profile: {}
    }
  }

  async componentDidMount() {
    this.apiClient = new APIClient();

    /*this.apiClient.getUserHistory().then((data) =>
      this.setState({
        pofile: data
      })
    )*/
  }

  createItems(item) {
    return (
      <li key={item._id}>
        <p className="queue-item">{item.predictionResult}</p>
      </li>
    )
  }

  render() {
    var historyEntries = this.state.pofile.history;
    var listItems = historyEntries.map(this.createItems);
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
