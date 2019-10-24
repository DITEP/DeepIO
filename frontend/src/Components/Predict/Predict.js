import React from "react";
import {withRouter} from 'react-router';
import './Predict.css';
import APIClient from '../../Actions/apiClient';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class Predict extends React.Component {
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
        const location = {
          pathname: '/login',
          state: { from: 'Predict', message: 'You have to be logged in to view this page.' }
        }
    
        this.props.history.push(location)
      }
    })
  }

	render () {
    return (
      <div className="container">
        <div className="container-fluid">

        </div>
      </div>
    )
  }
}
export default withRouter(Predict);