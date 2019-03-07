import React, { Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import * as service from '../../services/post';
import { createStore } from 'redux';
import { Link } from 'react-router-dom';

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.state = {
      user: null
    };
  }

  login = event => {
    event.preventDefault();
    const data = new FormData(event.target);
    service.userLogin(data);
  }

  signup = () => {
    this.props.modal = !this.props.modal;
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.props.modal} toggle={this.props.toggle}>
          <ModalHeader toggle={this.props.toggle}>Login Menu</ModalHeader>
          <Form onSubmit={this.login}>
            <ModalBody>
              <FormGroup>
                <Label for="userType">Login As</Label>
                <Input type="select" name="userSelect" id="userSelect">
                  <option>ADMIN</option>
                  <option>FREELANCER</option>
                  <option>CLIENT</option>
                </Input>
              </FormGroup>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="id" className="mr-sm-2">ID</Label>
                <Input type="text" name="inputId" id="inputId" placeholder="user id" />
              </FormGroup>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="password" className="mr-sm-2">Password</Label>
                <Input type="password" name="inputPassword" id="inputPassword" placeholder="user password" />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button type="submit">Sign in</Button>
              <Link to="/signup"><Button onClick={this.props.toggle}>Sign up</Button></Link>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default LoginModal;
