import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import '../styles/menu.css';

class Menu extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      showCategorySubmenu: false,
      showProductSubmenu: false,
      showNewsSubmenu: false,
      showClientSubmenu: false,
    };
  }

  toggleCategorySubmenu = () => {
    this.setState(prevState => ({
      showCategorySubmenu: !prevState.showCategorySubmenu,
    }));
  };

  toggleProductSubmenu = () => {
    this.setState(prevState => ({
      showProductSubmenu: !prevState.showProductSubmenu,
    }));
  };

  toggleNewsSubmenu = () => {
    this.setState(prevState => ({
      showNewsSubmenu: !prevState.showNewsSubmenu,
    }));
  };

  toggleClientSubmenu = () => {
    this.setState(prevState => ({
      showClientSubmenu: !prevState.showClientSubmenu,
    }));
  };

  handleLogout = () => {
    this.context.setToken('');
    this.context.setUsername('');
  };

  render() {
    const { showCategorySubmenu } = this.state;
    const { showProductSubmenu } = this.state;
    const { showNewsSubmenu } = this.state;
    const { showClientSubmenu } = this.state;
    const { username } = this.context;

    return (
      <div className="menu-container">
        <aside className="sidebar">
          <div className="user-info">
            <div className="avatar">{username.charAt(0)}</div>
            <div className="user-details">
              <span className="username">{username}</span>
            </div>
          </div>

          <ul className="menu-list">
            <li className="menu-item">
              <NavLink to="/admin/home" activeClassName="active">
                <i className="fas fa-home mr-2"></i> <span>Trang chủ</span>
              </NavLink>
            </li>

            {/* Menu Danh mục */}
            <li
              className={`menu-item category-toggle ${showCategorySubmenu ? 'open' : ''}`}
              onClick={this.toggleCategorySubmenu}
            >
              <span>
                <i className="fas fa-list-ul"></i> {/* icon Danh mục */}
                Danh mục <span className="arrow">{showCategorySubmenu ? '▲' : '▼'}</span>
              </span>
            </li>

            {showCategorySubmenu && (
              <ul className="submenu">
                <li className="submenu-item">
                  <Link to="/admin/category">
                    <i className="fas fa-table-list"></i> Danh sách danh mục
                  </Link>
                </li>
                <li className="submenu-item">
                  <Link to="/admin/category/add">
                    <i className="fas fa-plus-circle"></i> Thêm danh mục
                  </Link>
                </li>
              </ul>
            )}

            {/* Menu Sản phẩm */}
            <li
              className={`menu-item product-toggle ${showProductSubmenu ? 'open' : ''}`}
              onClick={this.toggleProductSubmenu}
            >
              <span>
                <i className="fas fa-boxes-stacked"></i> {/* icon Sản phẩm */}
                Sản phẩm <span className="arrow">{showProductSubmenu ? '▲' : '▼'}</span>
              </span>
            </li>

            {showProductSubmenu && (
              <ul className="submenu">
                <li className="submenu-item">
                  <Link to="/admin/product">
                    <i className="fas fa-box"></i> Danh sách sản phẩm
                  </Link>
                </li>
                <li className="submenu-item">
                  <Link to="/admin/product/add">
                    <i className="fas fa-plus"></i> Thêm sản phẩm
                  </Link>
                </li>
              </ul>
            )}

            {/* Menu Tin tức (News) */}
            {/* Menu Sản phẩm */}
            <li
              className={`menu-item news-toggle ${showNewsSubmenu ? 'open' : ''}`}
              onClick={this.toggleNewsSubmenu}
            >
              <span>
                <i className="fas fa-solid fa-newspaper"></i> {/* icon Sản phẩm */}
                Tin Tức <span className="arrow">{showNewsSubmenu ? '▲' : '▼'}</span>
              </span>
            </li>

            {showNewsSubmenu && (
              <ul className="submenu">
                <li className="submenu-item">
                  <Link to="/admin/news">
                    <i className="fas fa-box"></i> Danh sách Tin Tức
                  </Link>
                </li>
                <li className="submenu-item">
                  <Link to="/admin/news/add">
                    <i className="fas fa-plus"></i> Thêm Tin Tức
                  </Link>
                </li>
              </ul>
            )}
            {/* Menu Tin tức (News) */}
            {/* Menu Sản phẩm */}
            <li
              className={`menu-item news-toggle ${showClientSubmenu ? 'open' : ''}`}
              onClick={this.toggleClientSubmenu}
            >
              <span>
                <i className="fas fa-solid fa-cogs"></i> {/* icon Sản phẩm */}
                Client <span className="arrow">{showClientSubmenu ? '▲' : '▼'}</span>
              </span>
            </li>

            {showClientSubmenu && (
              <ul className="submenu">
                <li className="submenu-item">
                  <Link to="/admin/brands">
                    <i className="fas fa-box"></i> Brand
                  </Link>
                </li>
                <li className="submenu-item">
                  <Link to="/admin/contacts">
                    <i className="fas fa-box"></i> Contact
                  </Link>
                </li>
              </ul>
            )}
            
          </ul>

          <div className="logout-container">
            <Link to="/admin/home" onClick={this.handleLogout} className="logout-link">
              <i className="fas fa-sign-out-alt mr-1"></i> <span>Đăng xuất</span>
            </Link>
          </div>
        </aside>
      </div>
    );
  }
}

export default Menu;
