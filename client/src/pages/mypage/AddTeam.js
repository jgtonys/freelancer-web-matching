import React, { Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import * as service from '../../services/post';
import MakeTeam from './MakeTeam';

class AddTeam extends Component {
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
          <ModalHeader toggle={this.props.toggle}>팀 생성</ModalHeader>
          <ModalBody>
            <MakeTeam />
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default AddTeam;
