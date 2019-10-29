import React from "react";
import './Register.css';
import APIClient from '../../Actions/apiClient';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { withTranslation } from 'react-i18next';

class Register extends React.Component {
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
    
    if (this.state.password.length < 10) {
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
    const { t } = this.props;
    return (
        <div className="container">
          <div className="container-fluid">
            
            <Form className='sign-up-form col-8 col-centered' onSubmit={this.onSubmit}>
              
              <Form.Group>
                <Form.Label>{t('register.emailaddress')}</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder={t('register.emailplaceholder')}
                  name='email' 
                  value={this.state.email}
                  onChange={this.handleInputChange}
                  required
                />
                <Form.Text className="text-muted">
                  {t('register.emailhelper')}
                </Form.Text>
              </Form.Group>
            
              <Form.Group>
                <Form.Label>{t('register.password')}</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder={t('register.passwordplaceholder')}
                  name='password'
                  value={this.state.password}
                  onChange={this.handleInputChange}
                  required
                />
                
                <Form.Label>{t('register.repeatpassword')}</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder={t('register.repeatpasswordplaceholder')}
                  name='passwordRepeat'
                  value={this.state.passwordRepeat}
                  onChange={this.handleInputChange}
                  required
                />
                
                <p className={'password-error ' + (this.state.passwordMismatch ? 'show' : 'hidden')}>
                  {t('register.passwordmismatcherror')}
                </p>
                <p className={'password-error ' + (this.state.passwordSecurityError ? 'show' : 'hidden')}>
                  {t('register.passwordinsecureerror')}
                </p>
                <p className={'password-error ' + (this.state.emailAlreadyUsed ? 'show' : 'hidden')}>
                  {t('register.emailtakenerror')}
                </p>
                <p className={'password-error ' + (this.state.otherError ? 'show' : 'hidden')}>
                  {t('register.othererror')} 
                </p>                
              </Form.Group>
              
              <Button variant="primary" type="submit">
                {t('register.submitbutton')}
              </Button>
              
            </Form>
            
            <a href='/login'>{t('register.loginlinkbottom')}</a>
          
          </div>
        </div>
      );
    }
}
export default withTranslation()(Register);