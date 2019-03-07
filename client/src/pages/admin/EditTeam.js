import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Divider from '@material-ui/core/Divider';
import MaskedInput from 'react-text-mask';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import * as service from '../../services/post';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 1,
    marginRight: theme.spacing.unit * 1,
  },
  paper: {
    marginTop: theme.spacing.unit * 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  formcontrol: {
    width: '40%',
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class EditTeam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamMembers : [],
      teamId : [],
      verify : [false],
      create: true,
      teamShow: props.teamShow,
      teamName: this.props.team.name,
    };
  }


  componentDidMount() {

  }

  componentWillReceiveProps() {

  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  addSelect = () => {
    if(this.state.teamMembers.length == 5) alert("팀원을 더이상 추가할 수 없습니다.");
    else {
      const n = this.state.teamMembers.concat(0);
      const m = this.state.teamId.concat(0);
      const v = this.state.verify.push(false);
      this.setState({
        teamMembers: n,
        teamId: m,
        create: true,
      })
    }
  }

  handleIdChange = (event,val) => {
    const n = this.state.teamId.map((item,j) => {
      if(val === j) {
        return event.target.value;
      } else {
        return item;
      }
    });
    this.setState({
      teamId: n,
    })
  }

  idConfirm = async (event,val) => {
    let f = true;
    const user_id = this.state.teamId[val];
    const d = await service.idVerify(user_id).then(r => {
      return r.data;
    })
    .catch(e => {
      f = false;
      console.log(e.response.data.message);
      return [];
    });
    if(d.length == 0) {
      alert("해당 아이디의 사용자가 없습니다.");
    }
    else {
      alert("사용자 검증 완료");
      const dis = this.state.verify.map((item,j) => {
        if(val === j) {
          return true;
        } else {
          return item;
        }
      });
      let l = dis;
      let f = false;
      for(var i=0;i<l.length;i++) {
        if(l[i] == false) {
          f = true;
          break;
        }
      }
      this.setState({
        verify: dis,
        create: f,
      })
    }
  }

  addTeam = event => {
    event.preventDefault();
    const data = new FormData(event.target);
    data.append('team_id',this.props.team.id);
    data.append('members',this.state.teamId);
    service.updateTeam(data);
  }

  deleteSelect = (event,val) => {
    const tm = this.state.teamMembers.filter((item,j) => val !== j);
    const tl = this.state.teamId.filter((item,j) => val !== j);
    const v = this.state.verify.filter((item,j) => val !== j);

    let f = false;
    for(var i=0;i<v.length;i++) {
      if(v[i] == false) {
        f = true;
        break;
      }
    }
    this.setState({
      teamMembers: tm,
      teamId: tl,
      verify: v,
      create: f,
    })
  }

  showTeam = () => {
    let l = this.props.member.length;
    let tmpArr = [];
    let idArr = [];
    let tfArr = [];
    for(let i=0;i<l;i++) {
      idArr.push(this.props.member[i].user_id);
      tfArr.push(false);
    }
    this.setState({
      teamMembers: this.props.member,
      teamId: idArr,
      teamShow: true,
      verify: tfArr,
    })
  }



  render() {
    const { classes } = this.props;

    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggle} onClosed={(e) => {
        this.setState({teamShow:false});
      }}>
        <ModalHeader toggle={this.props.toggle}>{this.props.team.name}팀 편집</ModalHeader>
        <ModalBody>
          <main className={classes.main}>
            <CssBaseline />
            <Paper className={classes.paper}>
              <form onSubmit={this.addTeam} className={classes.form}>
                <FormControl margin="normal" required fullWidth>
                  <Input id="teamName" name="teamName" defaultValue={this.props.team.name}/>
                </FormControl>
                {!this.state.teamShow ? (
                  <Button onClick={this.showTeam} fullWidth>팀원 보기</Button>
                ):(
                  <div>
                  <Button onClick={this.addSelect} fullWidth>팀원 추가<Icon color="primary">add</Icon></Button>
                  {this.state.teamMembers.map((r,i) => {
                    return (
                      <Grid container spacing={24}>
                      <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="teamMember">팀원 아이디</InputLabel>
                        <Input inputProps={{
                          name: 'teamMember'+i,
                          id: 'teamMember'+i,
                        }}
                        onChange={(e) => this.handleIdChange(e,i)}
                        value={this.state.teamId[i]}
                        />
                      </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                      <FormControl fullWidth>
                      <Button variant="contained" className={classes.button} onClick={(e) =>this.idConfirm(e,i)} disabled={this.state.verify[i]}>
                        검증
                      </Button>
                      </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                      {r.member_id === this.props.team.mgr_id ? (
                        <Button disabled={true}>팀장</Button>
                      ):(
                        <Button onClick={(e) => this.deleteSelect(e,i)}><Icon color="primary">clear</Icon></Button>
                      )}

                      </Grid>
                      </Grid>
                    );
                  })}
                  </div>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={this.state.create}
                >
                  수정하기
                </Button>
              </form>
            </Paper>
          </main>
        </ModalBody>
      </Modal>

    );
  }
}

EditTeam.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditTeam);
