import React, { Component} from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import * as service from '../../services/post';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import withStyles from '@material-ui/core/styles/withStyles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

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
const buttonProducerStyle = {
    fontSize : 10,
    padding : 1,
};

class Done extends Component {
    constructor(props) {
        super(props);
        this.state = {
        uid : this.props.uid,
        rid : this.props.rid,
        requirement : this.props.requirement,
        pmax : this.props.pmax,
        pmin : this.props.pmin,
        career : this.props.career,
        data: [],
        tid : 0,
        tname : '',
        };
    }

    applyFinish = async() => { /*
        let f = true;
        const teamData = await service.getMyAvailableTeams(this.state.uid, this.state.rid, this.state.requirement, this.state.pmax, this.state.pmin, this.state.career).then(r => {
            return r.data;
        })
        .catch(e => {
            f= false;
            return [];
        });
        */
        //if(f) this.parsingData(teamData);
    }

    parsingData(array) {

    }

    requestComplete = (event,n) => {
      event.preventDefault();
      const data = new FormData(event.target);
      data.append('team_id',n.team_id);
      data.append('request_id',n.id);
      data.append('client_id',n.client_id);
      data.append('title',n.title);
      service.requestComplete(data);
    }

    componentDidMount() {
    }

    cancel = () => {
        this.props.modal = !this.props.modal;
    }

    render() {
      const { classes } = this.props;
        return (
        <div>
            <Modal isOpen={this.props.modal} toggle={this.props.toggle}>
            <ModalHeader toggle={this.props.toggle}>완료 신청 하시겠어요?</ModalHeader>
            <ModalBody>
            <form onSubmit={(e) => this.requestComplete(e,this.props.data)} className={classes.form} enctype="multipart/form-data">
              <FormControl margin="normal" required fullWidth>
                <label>결과물 보고서</label>
                <input type="file" name="completeReport" id="completeReport" />
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                완료 요청
              </Button>
            </form>
            </ModalBody>
            </Modal>
        </div>
        );
    }
}

Done.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Done);
