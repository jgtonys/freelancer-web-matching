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

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={[/\d/,/\d/," Years"]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}

function PhoneMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={['(',0,1,0,')',/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}

class ModifyUser extends React.Component {
  state = {
    phonemask: this.props.data.phone,
    textmask: '  ',
    agetextmask: '  ',
    selectionNr: [0],
    languages: [''],
    scores: [0],
    userType: 2,
    major: 'none',
    title: null,
    file_location: null,
    disabled: false,
    disabledMsg: '',
    menuLanguages: [
      'C',
      'JAVA',
      'NODEJS',
      'PYTHON',
      'C++',
      'JAVASCRIPT',
      'PHP',
      'C#'
    ],
    getInfo: [],
    passchange: false,
    portchange: false,
  };

  handleLangChange = (event,val) => {
    const n = this.state.languages.map((item,j) => {
      if(val === j) {
        return event.target.value;
      } else {
        return item;
      }
    });

    this.setState({
      languages: n,
    });
  }

  handleMajorChange = event => {
    this.setState({
      major: event.target.value,
    });
  }

  passchange() {
    this.setState({
      passchange: !this.state.passchange,
    })
  }

  portchange() {
    this.setState({
      portchange: !this.state.portchange,
    })
  }

  componentDidMount() {
    if(this.props.data.userType == 'FREELANCER') this.getFreelancerInfo();
  }

  getFreelancerInfo = async () => {
    const d = await service.getFreelancerInfo(this.props.data.id).then(r => {
      return r.data;
    })
    .catch(e => {
      alert(e.response.data.message);
      return [];
    });

    if(d[1].length > 1) {
      this.setState({
        disabledMsg: "2명 이상의 팀에 속해있으므로 수정이 불가합니다.",
        disabled: true,
      });
    }
    else if(d[2].length > 0) {
      this.setState({
        disabledMsg: "의뢰를 진행하고 있는 팀에 속해 있으므로 수정이 불가합니다.",
        disabled: true,
      });
    }
    else if(d[3].length > 0) {
      this.setState({
        disabledMsg: "의뢰를 신청한 상태이므로 수정이 불가합니다.",
        disabled: true,
      });
    }

    this.setState({
      getInfo: d[0],
    });

    var nl = [];
    var ll = [];
    var sl = [];
    for(let i=0;i<this.state.getInfo.length;i++) {
      nl = nl.concat(0);
      ll = ll.concat(this.state.getInfo[i].type.toUpperCase());
      sl = sl.concat(this.state.getInfo[i].level);
    }
    this.setState({
      textmask: this.state.getInfo[0].career,
      agetextmask: this.state.getInfo[0].age,
      major: this.state.getInfo[0].major,
      selectionNr: nl,
      languages: ll,
      scores: sl,
      title: this.state.getInfo[0].title,
      file_location: this.state.getInfo[0].file_location,
    })
  }

  handleScoChange = (event,val) => {
    const n = this.state.scores.map((item,j) => {
      if(val === j) {
        return event.target.value;
      } else {
        return item;
      }
    });
    this.setState({
      scores: n,
    })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  handleRadioChange = event => {
    this.setState({ userType: event.target.value });
  };

  deleteSelect = (event,val) => {
    const n = this.state.selectionNr.filter((item,j) => val !== j);
    const ln = this.state.languages.filter((item,j) => val !== j);
    const sn = this.state.scores.filter((item,j) => val !== j);
    this.setState({
      selectionNr: n,
      languages: ln,
      scores: sn,
    })

  }

  addSelect = () => {
    if(this.state.selectionNr.length == 8) alert("cannot add selection");
    else {
      const n = this.state.selectionNr.concat(0);
      const ln = this.state.languages.concat('');
      const sn = this.state.scores.concat(0);
      this.setState({
        selectionNr: n,
        languages: ln,
        scores: sn,
      })
    }
  }

  viewfile = event => {
    window.location = "/" + this.state.file_location;
  }

  addUser = event => {
    event.preventDefault();
    const data = new FormData(event.target);

    if(!data.get('userPassword')) {
      alert('비밀번호를 입력하세요');
    }
    else if(this.props.data.userType == 'CLIENT') {
      data.append('userType',3);
      data.append('phone',this.state.phonemask);
      data.append('cid',this.props.data.id);
      service.updateClient(data);
    }
    else if(!this.state.portchange) {
      alert('수정하려면 포트폴리오를 첨부하세요');
    }
    else if(this.props.data.userType == 'FREELANCER') { //freelancer
      data.append('userType',2);
      data.append('phone',this.state.phonemask);
      data.append('career',this.state.textmask);
      data.append('age',this.state.agetextmask);
      data.append('languages',this.state.languages);
      data.append('scores',this.state.scores);
      data.append('major',this.state.major);
      data.append('fid',this.props.data.id);
      service.updateFreelancer(data);
    }
    else {
      alert("관리자는 정보 수정이 불가합니다");
    }
  }




  render() {
    const { classes } = this.props;
    const { phonemask, textmask, agetextmask, major, title } = this.state;

    let permissionRendering = null;
    if (this.props.data.userType == 'FREELANCER') {
        permissionRendering = (
          <div>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="userCareer">Career</InputLabel>
            <Input
              value={textmask}
              onChange={this.handleChange('textmask')}
              id="userCareer"
              inputComponent={TextMaskCustom}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="userAge">Age</InputLabel>
            <Input
              value={agetextmask}
              onChange={this.handleChange('agetextmask')}
              id="userAge"
              inputComponent={TextMaskCustom}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="userMajor">User Major</InputLabel>
            <Input id="userMajor" name="userMajor" autoComplete="User Major" value={major} onChange={(e) => this.handleMajorChange(e)}/>
          </FormControl>

          <Divider />
          <Button onClick={this.addSelect} fullWidth>Prgramming Language<Icon color="primary">add</Icon></Button>
          {this.state.selectionNr.map((r,i) => {
            return (
              <Grid container spacing={24}>
              <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="languages">Programming Language</InputLabel>
                <Select
                  inputProps={{
                    name: 'languages'+i,
                    id: 'languages'+i,
                  }}
                  value={this.state.languages[i]}
                  onChange={(e) => this.handleLangChange(e,i)}
                >
                {this.state.menuLanguages.map((language,i) => {
                  return (
                    <MenuItem value={language}>{language}</MenuItem>
                  )
                })}
                </Select>
              </FormControl>
              </Grid>
              <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel htmlFor="scores">Score</InputLabel>
                <Select
                  inputProps={{
                    name: 'scores'+i,
                    id: 'scores'+i,
                  }}
                  value={this.state.scores[i]}
                  onChange={(e) => this.handleScoChange(e,i)}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                </Select>
              </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                <Button onClick={(e) => this.deleteSelect(e,i)}><Icon color="primary">clear</Icon></Button>
                </FormControl>
              </Grid>
              </Grid>
            );
          })}
          {!this.state.portchange ? (
            <Grid container spacing={24}>
              <Grid item xs={8}>
                <Button color="secondary" className={classes.submit} onClick={e => this.viewfile(e)} variant="contained" fullWidth>{title}</Button>
              </Grid>
              <Grid item xs={4}>
                <Button color="primary" className={classes.submit} onClick={e => this.portchange(e)} variant="contained" fullWidth>입력</Button>
              </Grid>
            </Grid>
          ):(
            <FormControl margin="normal" required fullWidth>
              <label>Portfolio</label>
              <input type="file" name="userPortfolio" id="userPortfolio" />
            </FormControl>
          )}

          </div>
        );
      } else {
        permissionRendering = <Divider />;
      }

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <form onSubmit={this.addUser} className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="userId">User ID</InputLabel>
              <Input id="userId" name="userId" defaultValue={this.props.data.user_id} autoFocus />
            </FormControl>
            {!this.state.passchange ? (
              <Grid container spacing={24}>
                <Grid item xs={8}>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="userPassword">User Password</InputLabel>
                    <Input defaultValue={this.props.data.password} disabled/>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <Button color="primary" className={classes.submit} onClick={e => this.passchange(e)} variant="contained" fullWidth>입력</Button>
                </Grid>
              </Grid>
            ) : (
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="userPassword">User Password</InputLabel>
                <Input name="userPassword" type="password" id="userPassword" />
              </FormControl>
            )}

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="userName">User Name</InputLabel>
              <Input name="userName" id="userName" defaultValue={this.props.data.name}/>
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="userPhone">Phone Number</InputLabel>
              <Input
                value={phonemask}
                onChange={this.handleChange('phonemask')}
                id="userPhone"
                inputComponent={PhoneMaskCustom}
              />
            </FormControl>
            {permissionRendering}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={this.state.disabled}
            >
            {this.state.disabled ?
                this.state.disabledMsg
            :(<div>수정하기</div>)}
            </Button>

          </form>
        </Paper>
      </main>
    );
  }
}

ModifyUser.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ModifyUser);
