import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import '../styles/login.css'; 

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      errorMessage: '',
      isLoading: false,  // Thêm state để quản lý loading
    };
  }

  render() {
    if (this.context.token === '') {
      return (
        <div className="login-container">
          <div className="login-box">
            <h2 className="login-title">ADMIN LOGIN</h2>
            <form onSubmit={this.btnLoginClick}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input 
                  type="text" 
                  id="username"
                  value={this.state.txtUsername} 
                  onChange={(e) => this.setState({ txtUsername: e.target.value })}
                  placeholder="Enter username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password"
                  value={this.state.txtPassword} 
                  onChange={(e) => this.setState({ txtPassword: e.target.value })}
                  placeholder="Enter password"
                />
              </div>
              {this.state.errorMessage && (
                <div className="error-message">{this.state.errorMessage}</div>
              )}
              {this.state.isLoading && <div className="loading-message">Đang đăng nhập...</div>} {/* Hiển thị loading */}
              <button type="submit" className="login-button" disabled={this.state.isLoading}>LOGIN</button>
            </form>
          </div>
        </div>
      );
    }
    return <div />;
  }

  btnLoginClick = async (e) => {
    e.preventDefault();
    const { txtUsername, txtPassword } = this.state;

    if (!txtUsername.trim() || !txtPassword.trim()) {
      this.setState({ errorMessage: '⚠️ Vui lòng nhập đầy đủ Username và Password!' });
      return;
    }

    const account = { username: txtUsername, password: txtPassword };
    this.setState({ isLoading: true, errorMessage: '' });  // Set loading khi bắt đầu login
    await this.apiLogin(account);
  };

  apiLogin = async (account) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/admin/login`, account, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = res.data;

      if (result.success) {
      this.context.setToken(result.token);
      this.context.setUsername(account.username);
      this.setState({ errorMessage: '', isLoading: false });
      this.props.onLoginSuccess(); // ✅ Gọi callback để App.jsx điều khiển chuyển trang
      }
      else {
        this.setState({ errorMessage: result.message, isLoading: false });
      }
    } catch (error) {
      // Nếu có lỗi 404 hoặc lỗi server
      if (error.response) {
        this.setState({ errorMessage: `⚠️ ${error.response.data.message || 'Lỗi kết nối đến server!'}`, isLoading: false });
      } else {
        this.setState({ errorMessage: '⚠️ Không thể kết nối đến máy chủ. Vui lòng thử lại!', isLoading: false });
      }
    }
  };
}

export default Login;
