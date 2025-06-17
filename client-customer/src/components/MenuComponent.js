import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';
import '../css/menu.css'; // Import CSS cho Menu

class Menu extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtKeyword: '',
      isOpen: false, // dropdown menu desktop
      isMobileMenuOpen: false, // menu trên mobile
      windowWidth: window.innerWidth,
    };
  }

  componentDidMount() {
    this.apiGetCategories();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({ windowWidth: window.innerWidth });
    if (window.innerWidth >= 992 && this.state.isMobileMenuOpen) {
      // Nếu chuyển sang desktop thì đóng menu mobile
      this.setState({ isMobileMenuOpen: false });
    }
  };

  toggleDropdown = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  toggleMobileMenu = () => {
    this.setState((prevState) => ({ isMobileMenuOpen: !prevState.isMobileMenuOpen }));
  };

  toggleMobileDropdown = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  render() {
    const { txtKeyword, isOpen, windowWidth, isMobileMenuOpen } = this.state;

    const cates = this.state.categories.map((item, index) => {
      return (
        <li key={item._id || index} className="nav-item">
          <Link className="nav-link" to={'/product/category/' + item._id} onClick={() => this.setState({ isMobileMenuOpen: false, isOpen: false })}>
            {item.name || 'Chưa có tên'}
          </Link>
        </li>
      );
    });

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container">
          {/* Nút hamburger toggle menu mobile */}
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarNav"
            aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
            aria-label="Toggle navigation"
            onClick={this.toggleMobileMenu}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Logo */}
          <Link className="navbar-brand" to="/" onClick={() => this.setState({ isMobileMenuOpen: false, isOpen: false })}>
            <img src="./assets/Logo-AI-VECTOR.png" alt="Home" style={{ width: '50px', height: '50px' }} />
          </Link>

          {/* Menu */}
          <div
            className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}
            id="navbarNav"
          >
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={() => this.setState({ isMobileMenuOpen: false })}>
                  Home
                </Link>
              </li>

              {/* Dropdown cho Product */}
              <li
                className={`nav-item dropdown ${isOpen ? 'show' : ''}`}
                onMouseEnter={() => {
                  if (windowWidth >= 992) this.setState({ isOpen: true });
                }}
                onMouseLeave={() => {
                  if (windowWidth >= 992) this.setState({ isOpen: false });
                }}
              >
                {/* Khi màn hình nhỏ, dùng onClick để mở dropdown */}
                <Link
                  className="nav-link"
                  to="/category"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded={isOpen ? 'true' : 'false'}
                  onClick={(e) => {
                    if (windowWidth < 992) {
                      e.preventDefault(); // ngăn reload trang
                      this.toggleMobileDropdown();
                    } else {
                      this.setState({ isOpen: true });
                    }
                  }}
                >
                  Product
                </Link>

                <ul
                  className={`dropdown-menu ${isOpen ? 'show' : ''}`}
                  style={{ position: windowWidth >= 992 ? 'absolute' : 'static', zIndex: 1000 }}
                >
                  {cates.length > 0 ? (
                    cates
                  ) : (
                    <li className="nav-item px-3 text-muted">Không có danh mục</li>
                  )}
                </ul>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/news" onClick={() => this.setState({ isMobileMenuOpen: false })}>
                  News
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about-us" onClick={() => this.setState({ isMobileMenuOpen: false })}>
                  About Us
                </Link>
              </li>
            </ul>

            {/* Mycart button */}
            <Link to="/mycart" className="mycart-link nav-link mr-2" onClick={() => this.setState({ isMobileMenuOpen: false })}>
              <i className="fas fa-shopping-cart"></i> Mycart
            </Link>

            {/* Form tìm kiếm */}
            <form
              className="form-inline my-2 my-lg-0"
              onSubmit={(e) => this.btnSearchClick(e)}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder="Search..."
                aria-label="Search"
                value={txtKeyword}
                onChange={(e) => this.setState({ txtKeyword: e.target.value })}
              />
              <button className="btn btn-search my-2 my-sm-0" type="submit">
                <i className="fas fa-search"></i> Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    );
  }

  btnSearchClick(e) {
    e.preventDefault();
    if (this.state.txtKeyword.trim()) {
      this.props.navigate('/product/search/' + this.state.txtKeyword);
      this.setState({ isMobileMenuOpen: false }); // Đóng menu mobile khi tìm kiếm
    }
  }

  apiGetCategories() {
    axios
      .get('/api/customer/categories')
      .then((res) => {
        this.setState({ categories: res.data });
      })
      .catch((err) => {
        console.error('Lỗi khi lấy danh mục:', err.response?.data || err.message);
      });
  }
}

export default withRouter(Menu);
