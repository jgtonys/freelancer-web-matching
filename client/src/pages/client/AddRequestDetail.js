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
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
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

class AddRequestDetail extends React.Component {
  state = {
    agetextmask: '  ',
    selectionNr: [0],
    languages: [''],
    scores: [0],
    userType: 2,
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

  componentDidMount() {

  }


  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }


  addRequest = event => {
    event.preventDefault();
    const data = new FormData(event.target);
    service.addRequest([data,this.state.languages,this.state.scores]);
  }

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



  render() {
    const { classes } = this.props;


    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <form onSubmit={this.addRequest} className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="title">의뢰 이름</InputLabel>
              <Input id="title" name="title" autoFocus />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="money">금액</InputLabel>
              <Input name="money" id="money"
                endAdornment={<InputAdornment position="end">원</InputAdornment>}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="career">최소 경력</InputLabel>
              <Input name="career" id="career"
                endAdornment={<InputAdornment position="end">년</InputAdornment>}
              />
            </FormControl>
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="people_min">최소 프리랜서 수</InputLabel>
                  <Input name="people_min" id="people_min"
                    endAdornment={<InputAdornment position="end">명</InputAdornment>}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="people_max">최대 프리랜서 수</InputLabel>
                  <Input name="people_max" id="people_max"
                    endAdornment={<InputAdornment position="end">명</InputAdornment>}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <TextField
                  id="start_date"
                  name="start_date"
                  label="개발 시작일"
                  type="date"
                  defaultValue="2018-12-12"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="end_date"
                  name="end_date"
                  label="개발 마감일"
                  type="date"
                  defaultValue="2018-12-13"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
            <FormControl margin="normal" required fullWidth>
              <label>스펙 문서</label>
              <input type="file" name="spec" id="spec"/>
            </FormControl>
            <Button onClick={this.addSelect} fullWidth>언어 최소 능력<Icon color="primary">add</Icon></Button>
            {this.state.selectionNr.map((r,i) => {
              return (
                <Grid container spacing={24}>
                <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="languages">language</InputLabel>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              의뢰 추가
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

AddRequestDetail.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddRequestDetail);
