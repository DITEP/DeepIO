import React from "react";
import './Profile.css';
import APIClient from '../../Actions/apiClient';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { withTranslation } from 'react-i18next';
import i18n from "i18next";

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      isFetchingData: true,
      profile: {},
      email: '',
      emailRepeat: '',
      oldPassword: '',
      password: '',
      passwordRepeat: '',
      oldPasswordWrong: false,
      passwordMismatch: false,
      hasSpecialChars: false,
      hasUppercaseChars: false,      
      passwordSecurityError: false,
      emailAlreadyUsed: false,
      emailMismatch: false,
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

  // Check the users auth token,
  // If there is none / it is blacklisted,
  // Push user to login, set message banner to appropriate message,
  // Store current location to redirect user back here after successful login
  async componentDidMount() {
    this.apiClient = new APIClient();

    this.apiClient.getAuth().then((data) => {
      this.apiClient.getUserDetails(data.logged_in_as.email).then((data) => {
        this.setState({
          isFetchingData: false,
          profile: data
        })
      })
    }).catch((err) => { 
  		if (err.response.status) {
        if (err.response.status === 401) {
    			const location = { 
    				pathname: '/login', 
    				state: { 
    					from: 'Profile', 
    					message: i18n.t('messages.notauthorized') 
    				} 
    			} 
    			this.props.history.push(location) 
   		  }
      } 
		})  
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

  // Bool switches to toggle the password and email boxes
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

  // Check whether new mail and repeat mail are the same,
  // Pass mail to backend, see whether address is used,
  // Save it, if it is fresh, return error if it is in use
  onSubmitEmail = (event) => {
    event.preventDefault();
    this.resetIndicators();
    
    if (this.state.email !== this.state.emailRepeat) {
      this.setState({
        emailMismatch: true
      })
      return;
    }
    
    this.apiClient.changeEmail({'email': this.state.email})
      .then(res => {
        this.apiClient.logout()
      })
      .then(res => {
        const location = {
          pathname: '/login',
          state: { message: i18n.t('messages.emailchangesuccess') }
        }    
        this.props.history.push(location)

        window.location.reload();
      }).catch((err) => { console.log(err)
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

  // Check whether new password and repeat password are the same,
  // Check that length is at least 10 digits
  // Pass old password to backend and check for correctness
  // If the above holds, change password, else show appropriate error message
  onSubmitPassword = (event) => {
    event.preventDefault();
    this.resetIndicators();
    
    if (this.state.password.length < 10) {
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
          state: { message: i18n.t('messages.passwordchangesuccess') }
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
    const { t } = this.props;
    return (
      <div className="container">
        <div className="container-fluid">
        
        <h2 className="profile-greeting">Hello, {this.state.profile.name}</h2>
        
          <div className="profile-settings-box"> 
            <div className={'change-profile-header ' +  (this.state.isEmailOpen ? 'active' : '')}>
              <div className="change-profile-link" onClick={this.openChangeEmail}>{t('profile.changemail')}</div>
            </div>
            <div className={'change-setting-container ' +  (this.state.isEmailOpen ? 'col' : 'hidden')}>
              <Form className='email-change-form col-8 col-centered' onSubmit={this.onSubmitEmail}>
                <Form.Group>
                  <Form.Label>{t('profile.emailinput')}</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder={t('profile.emailplaceholder')}
                    name='email'
                    value={this.state.email}
                    onChange={this.handleInputChange}
                    required
                  />
                  <Form.Label>{t('profile.emailrepeatinput')}</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder={t('profile.emailrepeatplaceholder')}
                    name='emailRepeat'
                    value={this.state.emailRepeat}
                    onChange={this.handleInputChange}
                    required
                  />
                  <Form.Text className="text-muted emailchange-info">
                    {t('profile.emailchangeinfo')}
                  </Form.Text>
                </Form.Group>
                
                <Button variant="primary" type="submit" className="submit-profile-change">
                  {t('profile.changemailsubmit')}
                </Button>
              </Form>
            </div>
          </div>
          
          <div className="profile-settings-box"> 
            <div className={'change-profile-header ' +  (this.state.isPasswordOpen ? 'active' : '')}>
              <div className="change-profile-link" onClick={this.openChangePassword}>{t('profile.changepassword')}</div>
            </div>
            <div className={'change-setting-container ' +  (this.state.isPasswordOpen ? 'col' : 'hidden')}>
              <Form className='email-change-form col-8 col-centered' onSubmit={this.onSubmitPassword}>
                <Form.Group>
                  <Form.Label>{t('profile.oldpassword')}</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder={t('profile.oldpasswordplaceholder')}
                    name='oldPassword'
                    value={this.state.oldPassword}
                    onChange={this.handleInputChange}
                  />                
                  <Form.Label>{t('profile.newpassword')}</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder={t('profile.newpasswordplaceholder')}
                    name='password'
                    value={this.state.password}
                    onChange={this.handleInputChange}
                  />
                  <Form.Label>{t('profile.repeatpassword')}</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder={t('profile.repeatpasswordplaceholder')}
                    name='passwordRepeat'
                    value={this.state.passwordRepeat}
                    onChange={this.handleInputChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="submit-profile-change">
                  {t('profile.changepasswordsubmit')}
                </Button>
              </Form>
            </div>
          </div>

          <p className={'password-error ' + (this.state.emailMismatch ? 'show' : 'hidden')}>
            {t('profile.emailmismatcherror')}
          </p>          
          <p className={'password-error ' + (this.state.emailAlreadyUsed ? 'show' : 'hidden')}>
            {t('profile.emailusederror')}
          </p>
          <p className={'password-error ' + (this.state.oldPasswordWrong ? 'show' : 'hidden')}>
            {t('profile.oldpasswordwrongerror')}
          </p>          
          <p className={'password-error ' + (this.state.passwordMismatch ? 'show' : 'hidden')}>
            {t('profile.passwordmismatcherror')}
          </p>
          <p className={'password-error ' + (this.state.passwordSecurityError ? 'show' : 'hidden')}>
            {t('profile.passwordnotsecureerror')}
          </p>
          <p className={'password-error ' + (this.state.otherError ? 'show' : 'hidden')}>
            {t('profile.othererror')}
          </p>

        </div>
      </div>
    );
  }
}

export default withTranslation()(Profile);
