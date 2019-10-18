import React from "react";
import './Header.css';

import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

const navbar = (props) => {
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">History</Nav.Link>
            <Nav.Link href="#link">New Job</Nav.Link>
            <Nav.Link href="#link">Queue</Nav.Link>

            
          </Nav>
          <Form inline className='mr-auto'>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          </Form>
        </Navbar.Collapse>
        
        <Navbar.Collapse id="profile-navbar-nav" className='justify-content-end'>
          <Nav >
            <NavDropdown title="Profile" id="basic-nav-dropdown" className='mr-auto'>
              <NavDropdown.Item href="#action/3.1">Show Profile</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Security</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      )
};

export default navbar;