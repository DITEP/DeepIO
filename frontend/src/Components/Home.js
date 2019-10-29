import React from "react";
import APIClient from '../Actions/apiClient';

export default class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
    };
	}
 
  async componentDidMount() {
    this.apiClient = new APIClient();  
  }

	render () {
    return (
      <div className="container">
        <div className="container-fluid">
          <p>Welcome</p>
          
        </div>
      </div>
      );
    }
}