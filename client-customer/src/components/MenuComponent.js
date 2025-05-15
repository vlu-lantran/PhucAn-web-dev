import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';
import '../App'; // Import CSS tùy chỉnh

class Menu extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtKeyword: '',
      isOpen: false,
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
  };

  toggleDropdown = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  render() {
    const { txtKeyword, isOpen, windowWidth } = this.state;

    const cates = this.state.categories.map((item, index) => {
      console.log('Danh mục:', item);
      return (
        <li key={item._id || index} className="nav-item">
          <Link className="nav-link" to={'/product/category/' + item._id}>
            {item.name || 'Chưa có tên'}
          </Link>
        </li>
      );
    });

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <img src="./assets/Logo-AI-VECTOR.png" alt="Home" style={{ width: '50px', height: '50px' }} />
                </Link>
              </li>

              <li
                className={`nav-item relative dropdown ${isOpen ? 'show' : ''}`}
                onMouseEnter={() => {
                  if (windowWidth >= 992) this.setState({ isOpen: true });
                }}
                onMouseLeave={() => {
                  if (windowWidth >= 992) this.setState({ isOpen: false });
                }}
              >
                <Link className="nav-link" to="/category">
                  Product
                </Link>

                <ul
                  className={`dropdown-menu-custom ${this.state.isOpen ? 'd-block' : 'd-none'}`}
                  style={{ position: 'absolute', zIndex: 1000 }}
                >
                  {cates.length > 0 ? (
                    cates
                  ) : (
                    <li className="nav-item px-3 text-muted">Không có danh mục</li>
                  )}
                </ul>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="#">
                  News
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#">
                  Service
                </Link>
              </li>
            </ul>

            <form className="form-inline my-2 my-lg-0" onSubmit={(e) => this.btnSearchClick(e)}>
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
    }
  }

  // Không còn dùng token ở đây
  apiGetCategories() {
    axios
      .get('/api/customer/categories')
      .then((res) => {
        console.log('API trả về:', res.data);
        this.setState({ categories: res.data });
      })
      .catch((err) => {
        console.error('Lỗi khi lấy danh mục:', err.response?.data || err.message);
      });
  }

  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setCustomer(null);
    this.context.setMycart([]);
  }
}

export default withRouter(Menu);
