import React from "react";
import './Login.css';
import APIClient from '../../Actions/apiClient';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      email: '',
      password: ''
    };
    
    this.handleInputChange = this.handleInputChange.bind(this);
	}

  async componentDidMount() {
    this.apiClient = new APIClient();  
  }
 
  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });  
  }
  
  onSubmit = (event) => {
    event.preventDefault();
    
    let user = {
      email: this.state.email,
      password: this.state.password
    }
    
    this.apiClient.login(user).then((data) =>
      console.log('user found', data)
    );
  }  

	render () {
    return (
        <div className="container">
          <div className="container-fluid">
          
            <Form className='log-in-form col-8 col-centered' onSubmit={this.onSubmit}>
          
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter email" 
                  name='email' 
                  value={this.state.email}
                  onChange={this.handleInputChange}
                  required
                />
                <Form.Text className="text-muted">
                  The email adress you have used to create an account.
                </Form.Text>
              </Form.Group>
            
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  name='password'
                  value={this.state.password}
                  onChange={this.handleInputChange}
                  required
                />
              </Form.Group>
              
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            
            <a href='/login'>Forgot your password? Click here to reset</a>
                        
          </div>
        </div>
      );
    }
}