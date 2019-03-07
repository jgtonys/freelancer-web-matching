import React, { Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import SendStarDetail from './SendStarDetail';
import * as service from '../../services/post';

class SendStar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {userId: null},
      dbUserData: [],
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
          <ModalHeader toggle={this.props.toggle}>결과물이 마음에 드시나요?</ModalHeader>
          <ModalBody>
            <SendStarDetail  id={this.props.id} />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default SendStar;
