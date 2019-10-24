import React from 'react';
import logo from './logo.svg';
import { Link, Route, Switch, BrowserRouter as Router } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Header from './Components/Header/Header';
import Home from './Components/Home';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Profile from './Components/Profile/Profile';
import Queue from './Components/Queue/Queue';
import History from './Components/History/History';
import Predict from './Components/Predict/Predict';

function App() {
    return (
      <Router>
        <div className="App">
          <div id='wrapper'>
            <header className="App-header">
      				<div className='header-contents'>
                <Header />
    				  </div>
            </header>
            
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/register" component={Register} />
              <Route path="/profile" component={Profile} />
              <Route path="/queue" component={Queue} />
              <Route path="/predict" component={Predict} />
              <Route path="/history" component={History} />
              <Route path="/login" component={Login} />
            </Switch>
            
          </div>
        </div>
      </Router>
    );
  }

export default App;
