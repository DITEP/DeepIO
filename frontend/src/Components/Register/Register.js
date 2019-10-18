import React from "react";
import './Register.css';
import APIClient from '../../Actions/apiClient';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class Register extends React.Component {
	constructor(props) {
		super();
		this.state = {
      email: '',
      password: '',
      passwordRepeat: '',
      passwordMismatch: false,
      passwordSecurityError: false,
      emailAlreadyUsed: false,
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
      passwordMismatch: false,
      passwordSecurityError: false,
      emailAlreadyUsed: false,
      otherError: false      
    });
  }
 
  onSubmit = (event) => {
    event.preventDefault();
    
    this.resetIndicators();
    
    if (this.state.password !== this.state.passwordRepeat) {
      this.setState({
        passwordMismatch: true
      })
      return;
    }
    
    if (this.state.password.length < 8) { // Maybe also uppercase and special chars?
      this.setState({
        passwordSecurityError: true
      })
      return;
    }
    
    let newUser = {
      email: this.state.email,
      password: this.state.password
    }
    
    this.apiClient.createUser(newUser).then((data) =>
      console.log('user created!')
    ).catch((err) => {
        if (err.response.status === 409) {
          this.setState({
            emailAlreadyUsed: true
          })
          return;
        }
        this.setState({
          otherError: true
        }) 
      }
    )
  }

	render () {
    return (
        <div className="container">
          <div className="container-fluid">
            
            <Form className='sign-up-form col-8 col-centered' onSubmit={this.onSubmit}>
              
              <Form.Group>
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
                  We'll never share your email with anyone else.
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
                
                <Form.Label>Repeat Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  name='passwordRepeat'
                  value={this.state.passwordRepeat}
                  onChange={this.handleInputChange}
                  required
                />
                
                <p className={'password-error ' + (this.state.passwordMismatch ? 'show' : 'hidden')}>
                  Passwords must match!
                </p>
                <p className={'password-error ' + (this.state.passwordSecurityError ? 'show' : 'hidden')}>
                  Password not secure enough!
                </p>
                <p className={'password-error ' + (this.state.emailAlreadyUsed ? 'show' : 'hidden')}>
                  This email address is already taken.
                </p>
                <p className={'password-error ' + (this.state.passwordSecurityError ? 'show' : 'hidden')}>
                  Your request could not be progressed. Please try again later.
                </p>                
              </Form.Group>
              
              <Button variant="primary" type="submit">
                Submit
              </Button>
              
            </Form>
            
            <a href='/login'>Already have an account? Click here to login</a>
          
          </div>
        </div>
      );
    }
}