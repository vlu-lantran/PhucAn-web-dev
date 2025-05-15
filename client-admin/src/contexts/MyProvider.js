import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // variables
      token: '',
      username: '',
      categories: [], // Thêm categories để lưu danh sách danh mục
      // functions
      setToken: this.setToken,
      setUsername: this.setUsername,
      setCategories: this.setCategories, // Thêm setCategories để cập nhật danh sách danh mục
    };
  }

  setToken = (value) => {
    this.setState({ token: value });
  };

  setUsername = (value) => {
    this.setState({ username: value });
  };

  setCategories = (categories) => {
    this.setState({ categories });
  };

  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;