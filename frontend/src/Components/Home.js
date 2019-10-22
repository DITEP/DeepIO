import React from "react";
import APIClient from '../Actions/apiClient';

export default class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      hello: ''
    };

		this.getPythonHello = this.getPythonHello.bind(this);
	}
 
  async componentDidMount() {
    this.apiClient = new APIClient();  
  }

  getPythonHello() {
    this.apiClient.getHello().then((data) =>
      this.setState({...this.state, hello: data})
    );
	}

	render () {
    return (
      <div>
        <p> Hello, {this.state.hello} </p>
			  <button onClick={this.getPythonHello}>
			    Say Hello!
			  </button>
      </div>
      );
    }
}