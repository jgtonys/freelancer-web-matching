import React, { Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import SendMessageDetail from './SendMessageDetail';
import * as service from '../../services/post';



class SendMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {userId: null},
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
          <ModalHeader toggle={this.props.toggle}>결과물이 마음에 안 드시나요?</ModalHeader>
          <ModalBody>
              <SendMessageDetail  id={this.props.id} />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default SendMessage;
