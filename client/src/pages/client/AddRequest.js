import React, { Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import AddRequestDetail from './AddRequestDetail';
import * as service from '../../services/post';

class AddRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {userId: null},
      dbUserData: [],
    };
  }

  componentDidMount() {
  }

  cancel = () => {
    this.props.modal = !this.props.modal;
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.props.modal} toggle={this.props.toggle}>
          <ModalHeader toggle={this.props.toggle}>의뢰 추가하기</ModalHeader>
          <ModalBody>
            <AddRequestDetail />
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default AddRequest;
