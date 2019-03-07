import React, { Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText, Card, CardText, CardBody,
  CardTitle, CardSubtitle } from 'reactstrap';
import * as service from '../../services/post';
import { createStore } from 'redux';
import { Link } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { request } from 'http';


class MsgModal extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    scores: 0,
    clientId: 0,
    requestId: 0,
    teamId: 0,
  };


  viewfile = (event,report) => {
    window.location = "/" + report;
  }

  handleScoChange = (event, client_id, request_id, team_id) => {
    this.setState({
      scores: event.target.value,
      clientId: client_id,
      requestId: request_id,
      teamId: team_id,
    })
  }

  addStar = event => {
    event.preventDefault();
    service.addStarClient([this.state.scores, this.state.clientId, this.state.requestId, this.state.teamId]);
    alert('감사합니다');
  }


  render() {
    return (
      <div>
        <Modal isOpen={this.props.modal} toggle={this.props.toggle} onClosed={this.props.onClosed}>
          <ModalHeader toggle={this.props.toggle}>새 메세지</ModalHeader>
            <ModalBody>
            {this.props.msg.map((m,j) => {
              return (
                <Card>
                  <CardBody>
                    {m.sent_from === 0 &&
                      <CardTitle>To {m.name}</CardTitle>
                    }
                    <CardTitle>{m.message}</CardTitle>
                    <CardSubtitle>{m.time}</CardSubtitle>
                    {(m.report !== 'none' && m.report !== 'done') &&
                        <Button onClick={(e) => this.viewfile(e,m.report)}>Report</Button>
                    }
                    {m.report === 'done' &&
                      <form onSubmit={this.addStar}>
                      <div>
                          <FormControl fullWidth>
                            <InputLabel htmlFor="scores">Score</InputLabel>
                            <Select
                              inputProps={{
                                name: 'scores',
                                id: 'scores',
                              }}
                              onChange={(e) => this.handleScoChange(e, m.client_id, m.request_id, m.team_id)}
                              value={this.state.scores}
                            >
                              <MenuItem value={0}>0</MenuItem>
                              <MenuItem value={1}>1</MenuItem>
                              <MenuItem value={2}>2</MenuItem>
                              <MenuItem value={3}>3</MenuItem>
                              <MenuItem value={4}>4</MenuItem>
                              <MenuItem value={5}>5</MenuItem>
                            </Select>
                          </FormControl>
                      </div>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                        >
                          평점 보내기
                        </Button>
                      </form>
                    }
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

export default MsgModal;
