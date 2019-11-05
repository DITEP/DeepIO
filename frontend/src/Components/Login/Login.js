import React from "react";
import './Login.css';
import APIClient from '../../Actions/apiClient';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { withTranslation } from 'react-i18next';

class Login extends React.Component {
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
    this.sendMail = this.sendMail.bind(this);
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
  
  // Check user password and mail,
  // If successful, set token in localStorage, 
  // Redirect to previous page if it exists or home 
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
      var {from} = this.props.location.state || {from: {pathname: '/'}}
      this.props.history.push(from); 
      window.location.reload()
    }).catch((err) => {console.log(err)
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
  
  sendMail = (event) => {
    event.preventDefault();
    this.apiClient.sendMail().then((data) => { console.log(data)})
  }

	render () {
    const { t } = this.props;
    return (
        <div className="container">
          <div className="container-fluid">
          
            <Form className='log-in-form col-8 col-centered' onSubmit={this.onSubmit}>
          
              <Form.Group controlId="formBasicEmail">
                <Form.Label>{t('login.email')}</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder={t('login.emailplaceholder')}
                  name='email' 
                  value={this.state.email}
                  onChange={this.handleInputChange}
                  required
                />
                <Form.Text className="text-muted">
                  {t('login.emailhelp')}
                </Form.Text>
              </Form.Group>
            
              <Form.Group>
                <Form.Label>{t('login.password')}</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder={t('login.passwordplaceholder')} 
                  name='password'
                  value={this.state.password}
                  onChange={this.handleInputChange}
                  required
                />
                
                <p className={'login-error ' + (this.state.passwordSecurityError ? 'show' : 'hidden')}>
                  {t('login.passwordsecurityerror')} 
                </p>                
                <p className={'login-error ' + (this.state.wrongCredentials ? 'show' : 'hidden')}>
                  {t('login.passwordcredentialerror')}  
                </p>
                <p className={'login-error ' + (this.state.otherError ? 'show' : 'hidden')}>
                  {t('login.othererror')}
                </p>
                
              </Form.Group>
              
              <Button variant="primary" type="submit">
                {t('login.loginbutton')}
              </Button>
            </Form>
            <a href='/register'>{t('login.registerlink')}</a>
            <br /><hr />
            <a onClick={this.sendMail}>{t('login.forgotpasswordlink')}</a>
                        
          </div>
        </div>
      );
    }
}

export default withTranslation()(Login);