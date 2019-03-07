import React from 'react';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import * as service from '../../services/post';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button} from 'reactstrap';


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      isOpen: false,
      modal: false,
      isLogin: window.sessionStorage.getItem('user')
    };
  }
  logout() {
    service.userLogout();
  }

  modalToggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    const isLoggedIn = this.state.isLogin;
    let navButton = null;
    if(!isLoggedIn) {
      navButton = (
        <NavItem>
          <NavLink onClick={this.modalToggle}>Login</NavLink>
          <LoginModal modal={this.state.modal} toggle={this.modalToggle} />
        </NavItem>
      );
    }
    else {
      navButton = (
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            {isLoggedIn}
          </DropdownToggle>
          <DropdownMenu right>
          <Link to="/mypage">
            <DropdownItem>
              My Page
            </DropdownItem>
            </Link>
            <DropdownItem>
              Some Page
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={(e) => {this.logout(e)}}>
              Logout
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      );
    }
    return (
      <div>
        <Navbar light expand="md">
          <NavbarBrand href="/">DB Project</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {navButton}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Header;
