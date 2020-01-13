import React from "react";
import {withRouter} from 'react-router';
import './Header.css';
import APIClient from '../../Actions/apiClient';

import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';

import { withTranslation } from 'react-i18next';

import logo from '../../Static/Images/g_roussy_logo.png';
import flag_fr from '../../Static/Images/fr_flag_icon.png';
import flag_gb from '../../Static/Images/uk_flag_icon.png';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userIsLoggedIn: false,
      redirect: false,
      showBanner: true
    }
    
    this.logout = this.logout.bind(this);
    this.closeBanner = this.closeBanner.bind(this);
  }

  async componentDidMount() { 
    this.apiClient = new APIClient(); 
    
    this.apiClient.getAuth().then((data) =>
      this.setState({
        userIsLoggedIn: true
      })
    ).catch((err) => { 
      console.log(err)
    })
  }
  
  logout = (event) => {
    this.apiClient.logout();
    this.setState({
      userIsLoggedIn: false,
    });
    this.props.history.push('/login');
  }
  
  closeBanner = (event) => {
    this.setState({
      showBanner: false
    })
  }
  
  render() {
    const { t, i18n } = this.props;
    var {message} = this.props.location.state || {message: ''}
    
    const changeLanguage = language => {
      if (language === 'en') {
        i18n.changeLanguage('en');
      }
      if (language === 'fr') {
        i18n.changeLanguage('fr-FR');
      }
    }
        
    return (
      <div>
        <div id="top-header">
          <span className="blue"></span>
          <span className="yellow"></span>
          <span className="orange"></span>
          <span className="violet"></span>
          <span className="blue"></span>
          <span className="yellow"></span>
          <span className="orange"></span>
          <span className="violet"></span>
        </div>
        <Navbar  variant="light" expand="lg">
          <Navbar.Brand href="https://www.gustaveroussy.fr/">
          <img
            src={logo}
            className="d-inline-block align-top"
            alt="Gustave Roussy"
          />
          </Navbar.Brand>
          
          <Nav className="mr-auto" id="brand-link">
            <Nav.Link href="/" className="navbar-link"> DeepIO </Nav.Link>
          </Nav>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/">{t('header.home')}</Nav.Link>
              <span className="nav-link-separator">|</span>
              <Nav.Link href="/queue">{t('header.queue')}</Nav.Link>
              <span className="nav-link-separator">|</span>
              <Nav.Link href="/predict">{t('header.prediction')}</Nav.Link>
              <span className="nav-link-separator">|</span>
              <Nav.Link href="/history">{t('header.showhistory')}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
  
          <NavDropdown title={t('languages.header')} id="language-selector" className='mr-auto'>
            <NavDropdown.Item id="language-en" onClick={() => changeLanguage('en')}>
              <img
                src={flag_gb}
                width="30"
                height="30"
                alt="English"
                className="d-inline-block align-top language-flag"
              /> 
              <p className="language-name">{t('languages.english')}</p>
            </NavDropdown.Item>
            <NavDropdown.Item id="language-fr" onClick={() => changeLanguage('fr')}>
              <img
                src={flag_fr}
                alt="French"
                width="30"
                height="30"
                className="d-inline-block align-top language-flag"
              />
              <p className="language-name">{t('languages.french')}</p>
            </NavDropdown.Item>
          </NavDropdown>
  
          <Navbar.Collapse id="profile-navbar-nav" className='justify-content-end'>
            <Nav >
              <Nav.Link href="/login" className={'mr-auto ' + (this.state.userIsLoggedIn ? 'hidden' : '')}>{t('header.showlogin')}</Nav.Link>
              <NavDropdown title={t('header.profile')} id="basic-nav-dropdown" className={'mr-auto ' + (this.state.userIsLoggedIn ? '' : 'hidden')}>
                <NavDropdown.Item href="/profile">{t('header.showprofile')}</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={this.logout}>{t('header.showlogout')}</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className={'banner ' + ((this.state.showBanner && message) ? '' : 'hidden')}>
          <p className="banner-message-text">{message}</p>
          <span className="banner-close" onClick={this.closeBanner}></span>
        </div>
      </div>
      )
    }
};
export default withRouter(withTranslation()(Header));