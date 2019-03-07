import React from 'react';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import * as service from '../../services/post';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import MsgModal from './MsgModal'
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
    this.msgModalToggle = this.msgModalToggle.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      isOpen: false,
      modal: false,
      msgModal:false,
      isLogin: window.sessionStorage.getItem('user'),
      userType: window.sessionStorage.getItem('userType'),
      msg: [],
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

  msgModalToggle() {
    this.setState({
      msgModal: !this.state.msgModal,
    });
  }

  componentDidMount() {
    let uid = window.sessionStorage.getItem('uid');
    if(uid) {
      let userType = window.sessionStorage.getItem('userType');
      if(userType == "CLIENT") {
        this.getClientBadgeMsg(uid);
      }
      else if(userType == "FREELANCER") {
        this.getFreeBadgeMsg(uid);
      }
    }

  }

  getClientBadgeMsg = async (uid) => {
    let f = true;
    const d = await service.getClientBadgeMsg(uid).then(r => {
      return r.data;
    })
    .catch(e => {
      f = false;
      return [];
    });
    this.setState({
      msg : d,
    });
  };

  getFreeBadgeMsg = async (uid) => {
    let f = true;
    const d = await service.getFreeBadgeMsg(uid).then(r => {
      return r.data;
    })
    .catch(e => {
      f = false;
      return [];
    });
    this.setState({
      msg : d,
    });
  };

  msgModalClose() {

    let uid = window.sessionStorage.getItem('uid');
    let userType = window.sessionStorage.getItem('userType');
    if(userType == "CLIENT") {
      service.readClientMsg(uid);
    }
    else if(userType == "FREELANCER") {
      service.readFreelancerMsg(uid);
    }
    window.location = "/";
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
        <Nav className="ml-auto" navbar>
        <NavItem>
          <NavLink onClick={this.modalToggle}>Login</NavLink>
          <LoginModal modal={this.state.modal} toggle={this.modalToggle} />
        </NavItem>
        </Nav>
      );
    }
    else {
      navButton = (
        <Nav className="ml-auto" navbar>
        {this.state.userType !== "ADMIN" &&
        <NavItem>
          <NavLink onClick={this.msgModalToggle}>
            <Badge className="ml-auto" badgeContent={this.state.msg.length} color="primary">
              <MailIcon />
            </Badge>
          </NavLink>
          <MsgModal modal={this.state.msgModal} toggle={this.msgModalToggle} msg={this.state.msg} onClosed={this.msgModalClose}/>
        </NavItem>
        }
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            {isLoggedIn}
          </DropdownToggle>
          <DropdownMenu right>
            {this.state.userType !== "ADMIN" &&
              <Link to="/mypage">
              <DropdownItem>
                My Page
              </DropdownItem>
              </Link>
            }
            {this.state.userType === "CLIENT" &&
            <div>
            <Link to="/messages">
            <DropdownItem>
              All Messages
            </DropdownItem>
            </Link>
            <DropdownItem divider />
            </div>
            }
            <DropdownItem onClick={(e) => {this.logout(e)}}>
              Logout
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
        </Nav>
      );
    }
    return (
      <div>
        <Navbar light expand="md">
          <NavbarBrand href="/">Freelancer Matching Service</NavbarBrand>

          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            {navButton}
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Header;
