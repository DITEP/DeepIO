import React from "react";
import './Register.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

    };

	}

	render () {
    return (
        <div className="container">
          <div className="container-fluid">
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" id='newEmail'/>
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>
            
              <Form.Group controlId="newPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" id='newPassword'/>
                
                <Form.Label>Repeat Password</Form.Label>
                <Form.Control type="password" placeholder="Password" id='newPasswordRepeat'/>
                                
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <a className='go-to-login' href='/login'>Already have an account? Click here to login</a>
          </div>
        </div>
      );
    }
}