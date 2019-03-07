import React, { Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle} from 'reactstrap';
import * as service from '../../services/post';


class MessageModal extends Component {
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
          <ModalHeader toggle={this.props.toggle}>팀 메세지</ModalHeader>
          <ModalBody>
            {this.props.msg.map((m,j) => {
              return (
                <Card>
                  <CardBody>
                    <CardTitle>{m.message}</CardTitle>
                    <CardSubtitle>{m.time}</CardSubtitle>
                  </CardBody>
                </Card>
              )
            })}
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default MessageModal;
