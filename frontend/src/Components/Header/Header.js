import React from "react";
import './Header.css';
import APIClient from '../../Actions/apiClient';

import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';


import logo from '../../Static/Images/g_roussy_logo.png';
import flag_fr from '../../Static/Images/fr_flag_icon.png';
import flag_gb from '../../Static/Images/uk_flag_icon.png';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userIsLoggedIn: false
    }
    this.changeLanguage = this.changeLanguage.bind(this);
    this.logout = this.logout.bind(this);
    
    if (window.location.pathname !== '/login') {
    
    }
  }

  async componentDidMount() { 
    this.apiClient = new APIClient(); 
    
    this.apiClient.getAuth().then((data) =>
      this.setState({
        userIsLoggedIn: true
      })
    ).catch((err) => {
      if (err.response.status === 401) {
        return;
      }
    })
  }

  changeLanguage = (event) => {
    let language = event.target.id;

    if (language === 'language-en') {
      console.log('english');
    }
    if (language === 'language-fr') {
      console.log('french');
    }
  }
  
  logout = (event) => {
    this.apiClient.logout();
    this.setState({
      userIsLoggedIn: false
    });
    return;
  }
  
  render() {
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
              <Nav.Link href="/">Home</Nav.Link>
              <span className="nav-link-separator">|</span>
              <Nav.Link href="/queue">Prediction Queue</Nav.Link>
              <span className="nav-link-separator">|</span>
              <Nav.Link href="/predict">New Prediction</Nav.Link>
            </Nav>
          </Navbar.Collapse>
  
          <NavDropdown title="Languages" id="language-selector" className='mr-auto'>
            <NavDropdown.Item id="language-en" onClick={this.changeLanguage}>
              <img
                src={flag_gb}
                width="30"
                height="30"
                alt="English"
                className="d-inline-block align-top language-flag"
              /> 
              <p className="language-name">English</p>
            </NavDropdown.Item>
            <NavDropdown.Item id="language-fr" onClick={this.changeLanguage}>
              <img
                src={flag_fr}
                alt="French"
                width="30"
                height="30"
                className="d-inline-block align-top language-flag"
              />
              <p className="language-name">French</p>
            </NavDropdown.Item>
          </NavDropdown>
  
          <Navbar.Collapse id="profile-navbar-nav" className='justify-content-end'>
            <Nav >
              <Nav.Link href="/login" className={'mr-auto ' + (this.state.userIsLoggedIn ? 'hidden' : '')}>Login</Nav.Link>
              <NavDropdown title="Profile" id="basic-nav-dropdown" className={'mr-auto ' + (this.state.userIsLoggedIn ? '' : 'hidden')}>
                <NavDropdown.Item href="/profile">Show Profile</NavDropdown.Item>
                <NavDropdown.Item href="/history">Prediction History</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={this.logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
      )
    }
};
