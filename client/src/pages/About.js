import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import MaskedInput from 'react-text-mask';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
  container: {
    display: 'block',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={[/\d/,/\d/,"년"]}
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
      mask={['(',0,1,0,')','-',/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/]}
      showMask
    />
  );
}

class About extends React.Component {
  render() {
    const { classes } = this.props;
    return (
        <div>
          <h2>회원가입 임시 폼</h2>
          <form className="classes.container" noValidate autoComplete="off">
            <TextField
            required
            className={classes.textField}
            id="userId"
            label="ID Required"
            defaultValue="id"
            margin="normal"
            />
            <TextField
            required
            className={classes.textField}
            id="userPassword"
            label="Password Required"
            defaultValue="password"
            margin="normal"
            />
            <TextField
            required
            className={classes.textField}
            id="userName"
            label="name Required"
            defaultValue="name"
            margin="normal"
            />
            <TextField
              required
              className={classes.textField}
              label="개발 경력"
              value="00"
              id="workAge"
              InputProps={{
                inputComponent: TextMaskCustom,
              }}
            />
            <TextField
            required
            className={classes.textField}
            id="userMajor"
            label="전공 학과"
            defaultValue="major"
            margin="normal"
            />
            <TextField
              required
              className={classes.textField}
              label="핸드폰 번호"
              value="(010)-____-____"
              id="userPhone"
              InputProps={{
                inputComponent: PhoneMaskCustom,
              }}
            />
          </form>
        </div>
    );
  }
};
export default withStyles(styles)(About);
//export default About;
