import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      // global state
      token: '',
      customer: null,
      mycart: [],
      username: '', // Thêm biến username vào state
    };
  }

  // Các hàm set state
  setToken = (value) => {
    this.setState({ token: value });
  }

  setCustomer = (value) => {
    this.setState({ customer: value });
  }

  setMycart = (value) => {
    this.setState({ mycart: value });
  }

  setUsername = (value) => {  // Thêm hàm setUsername
    this.setState({ username: value });
  }

  render() {
    return (
      <MyContext.Provider value={{
        token: this.state.token,
        customer: this.state.customer,
        mycart: this.state.mycart,
        username: this.state.username,  // Truyền username trong context
        setToken: this.setToken,
        setCustomer: this.setCustomer,
        setMycart: this.setMycart,
        setUsername: this.setUsername,  // Truyền hàm setUsername trong context
      }}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;
