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
import * as service from '../services/post';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(800 + theme.spacing.unit * 3 * 2)]: {
      width: 800,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
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

class Signup extends React.Component {
  state = {
    phonemask: '(010)    -    ',
    textmask: '  ',
    agetextmask: '  ',
    selectionNr: [0],
    languages: [''],
    scores: [0],
    userType: 2,
    portfolio: '',
    menuLanguages: [
      'C',
      'JAVA',
      'NODEJS',
      'PYTHON',
      'C++',
      'JAVASCRIPT',
      'PHP',
      'C#'
    ]
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

  onChangePortfolio = event => {
    this.setState({
      portfolio: event.target.files[0],
    })

  }

  addUser = event => {
    event.preventDefault();
    const data = new FormData(event.target);


    if(this.state.userType == 2) { //freelancer
      data.append('userType',this.state.userType);
      data.append('phone',this.state.phonemask);
      data.append('career',this.state.textmask);
      data.append('age',this.state.agetextmask);
      data.append('languages',this.state.languages);
      data.append('scores',this.state.scores);
      service.addUser(data);
    }
    else if(this.state.userType == 3) {
      data.append('userType',this.state.userType);
      data.append('phone',this.state.phonemask);
      service.addUser(data);
    }
  }



  render() {
    const { classes } = this.props;
    const { phonemask, textmask, agetextmask } = this.state;

    let permissionRendering = null;
    if (this.state.userType == 2) {
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
            <Input id="userMajor" name="userMajor" autoComplete="User Major" />
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
          <FormControl margin="normal" required fullWidth>
            <label>Portfolio</label>
            <input type="file" name="userPortfolio" id="userPortfolio" onChange={this.onChangePortfolio}/>
          </FormControl>
          </div>
        );
      } else {
        permissionRendering = <Divider />;
      }

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Registeration
          </Typography>
          <form onSubmit={this.addUser} className={classes.form} enctype="multipart/form-data">
          <FormControl component="fieldset" required fullWidth>
              <FormLabel>User Type</FormLabel>
              <RadioGroup
                aria-label="userType"
                name="userType"
                value={this.state.userType}
                onChange={this.handleRadioChange}
              >
                <FormControlLabel value="2" control={<Radio />} label="Freelancer" />
                <FormControlLabel value="3" control={<Radio />} label="Client" />
              </RadioGroup>
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="userId">User ID</InputLabel>
              <Input id="userId" name="userId" autoComplete="User ID" autoFocus />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="userPassword">User Password</InputLabel>
              <Input name="userPassword" type="password" id="userPassword" autoComplete="User Password" />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="userName">User Name</InputLabel>
              <Input name="userName" id="userName" autoComplete="User Name" />
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
            >
              Sign up
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Signup);
