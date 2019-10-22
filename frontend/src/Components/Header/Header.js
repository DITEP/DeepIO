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
  constructor() {
    super();

    this.state = {
      userIsLoggedIn: false
    }

    this.changeLanguage = this.changeLanguage.bind(this);
  }

  async componentDidMount() {
    this.apiClient = new APIClient();

    /*this.apiClient.getUser(user).then((data) =>
      console.log(data)
    )*/
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
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand href="https://www.gustaveroussy.fr/">
          <img
            src={logo}
            className="d-inline-block align-top"
            alt="Gustave Roussy"
          />
          {'DeepIO'}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/queue">Prediction Queue</Nav.Link>
              <Nav.Link href="/predict">New Prediction</Nav.Link>
            </Nav>
          </Navbar.Collapse>
  
          <NavDropdown title="Languages" id="basic-nav-dropdown" className='mr-auto'>
            <NavDropdown.Item id="language-en" onClick={this.changeLanguage}>
              <img
                src={flag_gb}
                width="30"
                height="30"
                alt="English"
                className="d-inline-block align-top"
              />
            </NavDropdown.Item>
            <NavDropdown.Item id="language-fr" onClick={this.changeLanguage}>
              <img
                src={flag_fr}
                alt="French"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
            </NavDropdown.Item>
          </NavDropdown>
  
          <Navbar.Collapse id="profile-navbar-nav" className={'justify-content-end ' + (this.state.userIsLoggedIn ? 'show' : 'hidden')}>
            <Nav >
              <NavDropdown title="Profile" id="basic-nav-dropdown" className='mr-auto'>
                <NavDropdown.Item href="/profile">Show Profile</NavDropdown.Item>
                <NavDropdown.Item href="/history">Prediction History</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
      )
    }
};
