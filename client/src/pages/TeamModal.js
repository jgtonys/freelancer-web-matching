import React, { Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import * as service from '../services/post';

class TeamModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idstore : this.props.id,
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
          <ModalHeader toggle={this.props.toggle}>팀 이름</ModalHeader>
          <ModalBody>
            {this.props.id}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default TeamModal;
