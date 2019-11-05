import React from "react";
import './Predict.css';
import APIClient from '../../Actions/apiClient';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class Predict extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      queue: []
    }
  }

  async componentDidMount() {
    this.apiClient = new APIClient();
  }

  return {
    render (
      <div className="container">
        <div className="container-fluid">

        </div>
      </div>
    )
  }
}
