import './App.css';
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import MyProvider from './contexts/MyProvider';

import Login from './components/LoginComponent';
import Main from './components/MainComponent';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }

  handleLoginSuccess = () => {
    this.setState({ isLoggedIn: true });
  };

  render() {
    return (
      <BrowserRouter basename="/admin/home">
        <MyProvider>
          {!this.state.isLoggedIn ? (
            <Login onLoginSuccess={this.handleLoginSuccess} />
          ) : (
            <Main />
          )}
        </MyProvider>
      </BrowserRouter>
    );
  }
}

export default App;
