import React, { Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle } from 'reactstrap';
import * as service from '../../services/post';

class TeamDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamData: this.props.data,
      members: [],
    }
  }

  /*componentDidMount() {
    this.parseMembers();

  }*/

  selectRequestTeam(tid,rid) {
    let team_id = parseInt(tid);
    let request_id = parseInt(rid.substring(1));
    service.setRequestTeam(team_id,request_id);

  }

  viewfile = (event,file_location) => {
    window.location = "/" + file_location;
  }

  cancel = () => {
    this.props.modal = !this.props.modal;
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.props.modal} toggle={this.props.toggle}>
          <ModalHeader toggle={this.props.toggle}>{this.props.data.name} 팀의 정보
            <Button color="info" onClick={(e) => this.selectRequestTeam(this.props.data.team_id,this.props.rid)}>선택</Button>
          </ModalHeader>
          <ModalBody>
          {this.props.mem.map((r,i) => {
            return (
              <Card>
                <CardBody>
                  <CardTitle>Freelancer {r.user_id}({r.name})</CardTitle>
                  <CardSubtitle>언어 능력 : {this.props.fl[i]}</CardSubtitle>
                  <CardText><p>나이 : {r.age}살</p>
                  <p>경력 : {r.career}년</p>
                  <p>전화 : {r.phone}</p>
                  <p>경력 : {r.career}년</p></CardText>
                  {r.request_count === 0 ? (
                    <CardText>평점 : 없음</CardText>
                  ):(
                    <CardText>평점 : {Math.round(r.grade_sum / r.request_count * 10)/10}</CardText>
                  )}
                  <Button
                    onClick={e => this.viewfile(e,r.file_location)}
                  >{r.title}
                  </Button>
                </CardBody>
              </Card>
            );
          })}
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default TeamDetail;
