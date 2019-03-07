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
import * as service from '../../services/post';
import EditTeam from './EditTeam';


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


class AllTeam extends React.Component {
  state = {
    teamlist: [],
    memberlist: [],
    modal: false,
    editModal: false,
    selectedTeam: [],
    selectedMember: [],
  };

  modalToggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  componentDidMount() {
    this.getTable();
  }

  getTable = async () => {
    let f = true;
    const d = await service.getAllTeam().then(r => {
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
    let specIndex = [];
    let scorIndex = [];
    let tmpJson = '';
    for(var i=0;i<array[0].length;i++) {
      if(teamList.indexOf(array[0][i].id) == -1) {
        teamList.push(array[0][i].id);
        teamSpec.push(array[0][i].type + array[0][i].max_level);
        specIndex.push([array[0][i].type]);
        tmpJson = {
          id: array[0][i].id,
          mgr_id: array[0][i].mgr_id,
          name: array[0][i].name,
          min_career: array[0][i].min_career,
        }
        teamInfo.push(tmpJson);
      }
      else {
        if(specIndex[teamList.indexOf(array[0][i].id)].indexOf(array[0][i].type) == -1) {
          let index = teamList.indexOf(array[0][i].id);
          teamSpec[index] += ',' + array[0][i].type + array[0][i].max_level;
          specIndex[teamList.indexOf(array[0][i].id)].push(array[0][i].type);
        }
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
      let disabled = false;
      for(var j=0;j<array[2].length;j++) {
        if(array[2][j].team_id == teamInfo[i].id) {
          disabled = true;
        }
      }
      resultJson = {
        id: teamInfo[i].id,
        mgr_id: teamInfo[i].mgr_id,
        name: teamInfo[i].name,
        min_career: teamInfo[i].min_career,
        spec: teamSpec[i],
        disabled: disabled,
      }
      resultarray.push(resultJson);
    }
    this.setState({
      teamlist: resultarray,
      memberlist: memberarray,
    });

  }

  editTeam = (event,team,i) => {
    this.setState({
      selectedTeam: team,
      selectedMember: this.state.memberlist[i],
    });
  }

  deleteTeam = (event,id) => {
    service.deleteTeam(id);
  }

  editModalToggle() {
    this.setState({
      editModal: !this.state.editModal
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
        <EditTeam modal={this.state.editModal} toggle={(e) => this.editModalToggle(e)} team={this.state.selectedTeam} member={this.state.selectedMember} teamShow={false} />
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
                      {m.user_id}님({m.name}) {m.age}세 경력{m.career}년 평점: 총({m.grade_sum}점)/{m.request_count}개
                    </Typography>
                  )
                })}
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary" disabled={team.disabled} onClick={(e) => {
                this.editTeam(e,team,i);
                this.editModalToggle(e);
              }}>
                팀 편집
              </Button>
              <Button size="small" color="primary" disabled={team.disabled} onClick={(e) => this.deleteTeam(e,team.id)}>
                팀 삭제
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

AllTeam.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles,{ withTheme: true })(AllTeam);
