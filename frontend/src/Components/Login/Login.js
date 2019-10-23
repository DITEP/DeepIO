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
      password: '',
      passwordSecurityError: false,      
      wrongCredentials: false,
      otherError: false
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
  
  resetIndicators = () => {
    return this.setState({
      passwordSecurityError: false,    
      wrongCredentials: false,
      otherError: false
    });
  }
  
  onSubmit = (event) => {
    event.preventDefault();
    
    this.resetIndicators();
    
    if (this.state.password.length < 8) { // Maybe also uppercase and special chars?
      this.setState({
        passwordSecurityError: true
      })
      return;
    }    
    
    let user = {
      email: this.state.email,
      password: this.state.password
    }
    
    this.apiClient.login(user)
    .then(res => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('refresh', res.data.refresh);
      this.props.history.push({
        pathname: '/',
        state: { isLoggedIn: true }
      })
      window.location.reload()
    }).catch((err) => {
      if (err.response.status === 401) {
        this.setState({
          wrongCredentials: true
        })
        return;
      }
      this.setState({
        otherError: true
      })
    })
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
                
                <p className={'login-error ' + (this.state.passwordSecurityError ? 'show' : 'hidden')}>
                  Password not long enough!
                </p>                
                <p className={'login-error ' + (this.state.wrongCredentials ? 'show' : 'hidden')}>
                  Your email address or password is not correct.
                </p>
                <p className={'login-error ' + (this.state.otherError ? 'show' : 'hidden')}>
                  Something went wrong. Please try again later.
                </p>
                
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