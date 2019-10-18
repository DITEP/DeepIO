import React from 'react';
import logo from './logo.svg';
import { Link, Route, Switch, BrowserRouter as Router } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Header from './Components/Header/Header';
import Home from './Components/Home';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';

function App() {
    return (<Router>
      <div className="App">
        <header className="App-header">
  				<div className='header-contents'>
            <Header />
				  </div>
        </header>
        
        <Switch>
            <Route path="/" exact component={Home} />          
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
          </Switch>
      </div></Router>
    );
  }

export default App;
