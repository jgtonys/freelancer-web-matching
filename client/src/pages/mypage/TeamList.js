import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Divider from '@material-ui/core/Divider';
import AddTeam from './AddTeam';
import MessageModal from './MessageModal';
import * as service from '../../services/post';


const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
    position: 'relative',
    minHeight: 200,
  },
  fab: {
    margin: theme.spacing.unit,
  },
  media: {
    height: 140,
  },
  addbutton: {
    marginBottom: theme.spacing.unit * 5,
  }
});


class TeamList extends React.Component {
  state = {
    teamlist: [],
    memberlist: [],
    modal: false,
    messageModal: false,
    setTeamMessage: [],
  };

  modalToggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  messageModalToggle() {
    this.setState({
      messageModal: !this.state.messageModal
    });
  }

  setMessage = async (e,t) => {
    let f = true;
    const d = await service.getTeamMessage(t).then(r => {
      return r.data;
    })
    .catch(e => {
      f = false;
      console.log(e.response.data.message);
      return [];
    });

    this.setState({
      setTeamMessage: d,
    });
  }

  componentDidMount() {
    this.getTable();
  }

  getTable = async () => {
    const uid = window.sessionStorage.getItem('uid');
    let f = true;
    const d = await service.getMyTeam(uid).then(r => {
      return r.data;
    })
    .catch(e => {
      f = false;
      console.log(e.response.data.message);
      return [];
    });

    if(d.length == 0) alert("팀정보가 없습니다.");
    else this.parsingData(d);
  }

  parsingData(array) {
    let teamName = '';
    let teamList = [];
    let teamInfo = [];
    let teamCareer = 0;
    let teamSpec = [];
    let tmpJson = '';
    for(var i=0;i<array[0].length;i++) {
      if(teamList.indexOf(array[0][i].id) == -1) {
        teamList.push(array[0][i].id);
        teamSpec.push(array[0][i].type + array[0][i].max_level);
        tmpJson = {
          name: array[0][i].name,
          min_career: array[0][i].min_career,
        }
        teamInfo.push(tmpJson);
      }
      else {
        let index = teamList.indexOf(array[0][i].id);
        teamSpec[index] += ',' + array[0][i].type + array[0][i].max_level;
      }
    }
    let resultarray = [];
    let memberarray = [];
    let resultJson = '';
    let teamidarray = [];
    for(var i=0;i<teamList.length;i++) {
      teamidarray = [];
      for(var j=0;j<array[1].length;j++) {
        if(teamList[i] == array[1][j].team_id) {
          teamidarray.push(array[1][j]);
        }
      }
      memberarray.push(teamidarray);
    }
    for(var i=0;i<teamList.length;i++) {
      resultJson = {
        id: teamList[i],
        name: teamInfo[i].name,
        min_career: teamInfo[i].min_career,
        spec: teamSpec[i],
      }
      resultarray.push(resultJson);
    }
    this.setState({
      teamlist: resultarray,
      memberlist: memberarray,
    });

  }

  render() {
    const { classes, theme } = this.props;
    const transitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen,
    };

    const fab = {
        color: 'primary',
        className: classes.fab,
        icon: <AddIcon />,
    };

    return (
      <div>
      <Button variant="contained" color="primary" className={classes.addbutton} onClick={e =>this.modalToggle(e)}>
        <AddIcon />
        TEAM 생성
      </Button>
      <AddTeam modal={this.state.modal} toggle={e =>this.modalToggle(e)}/>
      <MessageModal modal={this.state.messageModal} msg={this.state.setTeamMessage} toggle={e =>this.messageModalToggle(e)}/>
      {this.state.teamlist.map((team,i) => {
        return (
          <div>
          <Card className={classes.card}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {team.name}
                </Typography>
                <Typography component="p">
                  최소경력 : {team.min_career}
                </Typography>
                <Typography component="p">
                  팀 스펙 : {team.spec}
                </Typography>
                {this.state.memberlist[i].map((m,j) => {
                  return (
                    <Typography component="p">
                      {m.user_id}님({m.name}) {m.age}세 경력{m.career}년 평점: {Math.round(m.grade_sum / m.request_count * 10)/10}점
                    </Typography>
                  )
                })}
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary" onClick={(e) => {
                this.setMessage(e,team.id);
                this.messageModalToggle(e);
              }}>
                팀 메세지
              </Button>
            </CardActions>
          </Card>
          <Divider variant="middle" />
          </div>
        )
      })}
      </div>
    );
  }
}

TeamList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles,{ withTheme: true })(TeamList);
