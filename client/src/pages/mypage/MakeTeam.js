import React from 'react';
import PropTypes from 'prop-types';
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

class MakeTeam extends React.Component {
  state = {
    teamMembers : [0],
    teamId : [0],
  };

  componentDidMount() {

  }

  addSelect = () => {
    if(this.state.teamMembers.length == 5) alert("팀원을 더이상 추가할 수 없습니다.");
    else {
      const n = this.state.teamMembers.concat(0);
      const m = this.state.teamId.concat(0);
      this.setState({
        teamMembers: n,
        teamId: m,
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

  idConfirm = (event,val) => {
    const user_id = this.state.teamId[val];
    console.log(user_id);
  }

  addTeam = event => {
    console.log("asdfasdfasdf");
    event.preventDefault();
    const data = new FormData(event.target);
    service.addTeam([data,this.state.teamId]);
    alert("팀 생성이 완료되었습니다.");
  }

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <form onSubmit={this.addTeam} className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="teamName">Team Name</InputLabel>
              <Input id="teamName" name="teamName" autoFocus />
            </FormControl>
            <Button onClick={this.addSelect} fullWidth>팀원 추가<Icon color="primary">add</Icon></Button>
            {this.state.teamMembers.map((r,i) => {
              return (
                <Grid container spacing={24}>
                <Grid item xs={8}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="teamMember">팀원 아이디</InputLabel>
                  <Input inputProps={{
                    name: 'teamMember'+i,
                    id: 'teamMember'+i,
                  }}
                  onChange={(e) => this.handleIdChange(e,i)}
                  />
                </FormControl>
                </Grid>
                <Grid item xs={4}>
                <FormControl fullWidth>
                <Button variant="contained" className={classes.button} onClick={(e) =>this.idConfirm(e,i)}>
                  확인
                </Button>
                </FormControl>
                </Grid>
                </Grid>
              );
            })}
            <FormControl margin="normal" required fullWidth>
              <label>Team Photo</label>
              <input type="file" name="teamPhoto" id="teamPhoto"/>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              생성하기
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

MakeTeam.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MakeTeam);
