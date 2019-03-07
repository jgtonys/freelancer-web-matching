import React, { Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import * as service from '../../services/post';
import InputLabel from '@material-ui/core/InputLabel';
import withStyles from '@material-ui/core/styles/withStyles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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

class Apply extends Component {
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

    getTeams = async() => {
        let f = true;
        const teamData = await service.getMyAvailableTeams(this.state.uid, this.state.rid, this.state.requirement, this.state.pmax, this.state.pmin, this.state.career).then(r => {
            return r.data;
        })
        .catch(e => {
            f= false;
            return [];
        });

        if(f) this.parsingData(teamData);
    }

    parsingData(array) {
        let parsedArray = [];
        let parsedjson = '';

        for(let i = 0; i < array.length; i++) {
            parsedjson = {
                tid: array[i].id,
                tname: array[i].name,
                tcareer: array[i].min_career,
            }
            parsedArray.push(parsedjson);
        }
        this.setState({
        data: parsedArray,
        });
    }

    componentDidMount() {
    }

    cancel = () => {
        this.props.modal = !this.props.modal;
    }

    applyTeam = async(event) => {
        event.preventDefault();

        let f = true;
        const teamData = await service.applyTeamRequest(this.state.tid, this.state.rid).then(r => {
            window.location = "/";
            return r.data;
        })
        .catch(e => {
            f= false;
            return [];
        });

        if(f)
            alert('신청되었습니다');
        else
            alert('신청에 실패하였습니다. 이미 신청되었는지 확인하세요');
    }

    handleTeamChange = (event) => {
        let val = event.target.value;
        event.persist();
        this.setState(() => ({
            tid: val,
        }), () => {

        });
    }
    setStateData() {
        this.setState(() => ({
            //check this place changes uid 'unDefined'
            rid : this.props.rid,
            requirement : this.props.requirement,
            pmax : this.props.pmax,
            pmin : this.props.pmin,
            career : this.props.career,
            //tid : this.props.tid,
            //tname : this.state.tname,
        }), () => {
            this.getTeams();
        });
    }

    render() {
        return (
        <div>
            <Modal isOpen={this.props.modal} onClick={(e) => {this.setStateData();}} toggle={this.props.toggle}>
            <ModalHeader toggle={this.props.toggle}>신청 하시겠어요?</ModalHeader>
            <ModalBody>
                <form onSubmit={this.applyTeam}>
                <div>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="Team List">Team List</InputLabel>

                        <Select
                            onChange={(e) => this.handleTeamChange(e)}
                            value={this.state.tid}
                        >
                            {this.state.data.map((team, i) => {
                                return (
                                    <MenuItem value={team.tid}>{team.tname}</MenuItem>
                                );
                            })}

                        </Select>
                    </FormControl>
                </div>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    >
                    신청하기
                </Button>
                </form>
            </ModalBody>
            </Modal>
        </div>
        );
    }
}

export default withStyles(styles)(Apply);
