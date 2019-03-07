import React, { Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import * as service from '../../services/post';
import ModifyUser from './ModifyUser';

class UserDetail extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.setState({
      user: this.props.data,
    })
  }

  cancel = () => {
    this.props.modal = !this.props.modal;
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.props.modal} toggle={this.props.toggle}>
          <ModalHeader toggle={this.props.toggle}>{this.props.data.user_id} 님의 정보</ModalHeader>
          <ModalBody>
            <ModifyUser data={this.props.data}/>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default UserDetail;
