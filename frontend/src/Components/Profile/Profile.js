import React from "react";
import './Profile.css';
import APIClient from '../../Actions/apiClient';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      profile: {},
      email: '',
      oldPassword: '',
      password: '',
      passwordRepeat: '',
      oldPasswordWrong: false,
      passwordMismatch: false,
      passwordSecurityError: false,
      emailAlreadyUsed: false,
      otherError: false,

      isPasswordOpen: false,
      isUsernameOpen: false,
      isEmailOpen: false,

      passwordChangeSuccess: false,
      emailChangeSuccess: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.openChangeEmail = this.openChangeEmail.bind(this);
    this.openChangePassword = this.openChangePassword.bind(this);
	}

  async componentDidMount() {
    this.apiClient = new APIClient();

    /*this.apiClient.getUser(newUser).then((data) =>
      this.setState({
        profile: data
      })
    )*/
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

  openChangeEmail() {
    this.setState({
      isEmailOpen: !this.state.isEmailOpen,
      isPasswordOpen: false
    })
  }

  openChangePassword() {
    this.setState({
      isPasswordOpen: !this.state.isPasswordOpen,
      isEmailOpen: false
    })
  }

  onSubmitEmail = (event) => {
    event.preventDefault();
    this.resetIndicators();

    this.apiClient.changeEmail(this.state.email)
    .then(res => {
      this.setState({
        emailChangeSuccess: true
      })
    }).catch((err) => {
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

  onSubmitPassword = (event) => {
    event.preventDefault();
    this.resetIndicators();

    if (this.state.oldPassword !== true) { // TODO: Check against password in db, show error or pass
      console.log('show message');
    }
    
    if (this.state.password.length < 8) { // Maybe also uppercase and special chars?
      this.setState({
        passwordSecurityError: true
      })
      return;
    }

    if (this.state.password !== this.state.passwordRepeat) {
      this.setState({
        passwordMismatch: true
      })
      return;      
    }
    
    this.apiClient.checkPassword({'password': this.state.oldPassword}).then((result) => { 
      this.apiClient.changePassword({'password': this.state.password})
      .then(res => {
        this.apiClient.logout()
      })
      .then(res => {
        const location = {
          pathname: '/login',
          state: { message: 'Your password has been changed. Please log back in with your new credentials.' }
        }    
        this.props.history.push(location)

        window.location.reload();
      }).catch((err) => { console.log(err)
        this.setState({
          otherError: true
        })
        return;
      })
    }).catch((err) => {
      if (err.response.status === 401) {
        this.setState({
            oldPasswordWrong: true
          })
          return;
      }
      this.setState({
        otherError: true
      })
      return;
    }) 
  }

  render() {
    return (
      <div className="container">
        <div className="container-fluid">

          <div className="profile-settings-box"> 
            <div className={'change-profile-header ' +  (this.state.isEmailOpen ? 'active' : '')}>
              <a className="change-profile-link" onClick={this.openChangeEmail}>Change email</a>
            </div>
            <div className={'change-setting-container ' +  (this.state.isEmailOpen ? 'col' : 'hidden')}>
              <Form className='email-change-form col-8 col-centered' onSubmit={this.onSubmitEmail}>
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
                </Form.Group>
                <Button variant="primary" type="submit" className="submit-profile-change">
                  Submit
                </Button>
              </Form>
            </div>
          </div>
          
          <div className="profile-settings-box"> 
            <div className={'change-profile-header ' +  (this.state.isPasswordOpen ? 'active' : '')}>
              <a className="change-profile-link" onClick={this.openChangePassword}>Change password</a>
            </div>
            <div className={'change-setting-container ' +  (this.state.isPasswordOpen ? 'col' : 'hidden')}>
              <Form className='email-change-form col-8 col-centered' onSubmit={this.onSubmitPassword}>
                <Form.Group>
                  <Form.Label>Old Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name='oldPassword'
                    value={this.state.oldPassword}
                    onChange={this.handleInputChange}
                  />                
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name='password'
                    value={this.state.password}
                    onChange={this.handleInputChange}
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
                </Form.Group>
                <Button variant="primary" type="submit" className="submit-profile-change">
                  Submit
                </Button>
              </Form>
            </div>
          </div>
          
          <p className={'password-error ' + (this.state.emailAlreadyUsed ? 'show' : 'hidden')}>
            This email address is already taken.
          </p>
          <p className={'password-error ' + (this.state.oldPasswordWrong ? 'show' : 'hidden')}>
            Your old password is incorrect.
          </p>          
          <p className={'password-error ' + (this.state.passwordMismatch ? 'show' : 'hidden')}>
            Passwords must match!
          </p>
          <p className={'password-error ' + (this.state.passwordSecurityError ? 'show' : 'hidden')}>
            Password not secure enough!
          </p>
          <p className={'password-error ' + (this.state.otherError ? 'show' : 'hidden')}>
            Your request could not be progressed. Please try again later.
          </p>

        </div>
      </div>
    );
  }
}