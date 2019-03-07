import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import * as service from '../../services/post';
import axios from 'axios';
import Button from '@material-ui/core/Button';

import Apply from './Apply';
import Done from './Done';
import TeamModal from '../TeamModal';


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'id', numeric: false, disablePadding: false, label: '' },
  { id: 'title', numeric: false, disablePadding: false, label: '의뢰 이름' },
  { id: 'money', numeric: false, disablePadding: false, label: '금액' },
  { id: 'start_date', numeric: false, disablePadding: false, label: '개발 시작일' },
  { id: 'end_date', numeric: false, disablePadding: false, label: '개발 마감일' },
  { id: 'requirement', numeric: false, disablePadding: false, label: '언어 조건' },
  { id: 'people', numeric: false, disablePadding: false, label: '제한 인원' },
  { id: 'career', numeric: false, disablePadding: false, label: '제한 경력' },
  { id: 'request_doc', numeric: false, disablePadding: false, label: '의뢰 스펙' },
  { id: 'team', numeric: false, disablePadding: false, label: '참여 팀' },
  { id: 'apply', numeric: false, disablePadding: false, label: '신청' },
];

class MyRequestHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

MyRequestHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});


const styles = theme => ({
  root: {
    width: '100%',
  },
  table: {
    marginLeft: theme.spacing.unit * 1,
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

const buttonProducerStyle = {
  fontSize : 10,
  padding : 1,
};

class MyRequest extends React.Component {
  state = {
    order: 'desc',
    orderBy: 'id',
    selected: [],
    data: [],
    selectedUser: [],
    isOpen: false,
    modal: false,
    modal2: false,
    page: 0,
    rowsPerPage: 5,
    index: this.props.index,
    uid: window.sessionStorage.getItem('uid'),
    rid: 0,
    requirement: [],
    pmax: 0,
    pmin: 0,
    career: 0,
    doneData: [],
    setTeam: 0,
    teamModal: false,
  };

  setStateData(e, _uid, _rid, _requirement, _pmax, _pmin, _career) {
    this.setState(() => ({
      uid : _uid,
      rid : _rid,
      requirement : _requirement,
      pmax : _pmax,
      pmin : _pmin,
      career : _career,
    }), () => {
      this.modalToggle();
    });
  }
  setStateData2(e, n) {
    this.getTeamMgr(n);
  }

  getTeamMgr = async (n) => {
    const uid = this.state.uid;
    let f = true;
    const d = await service.getTeamMgr(n.id).then(r => {
      return r.data;
    })
    .catch(e => {
      f = false;
      return [];
    });

    if(d.length == 0) {
      alert("팀에 팀장이 오류가 있습니다.");
    }
    else if(f && uid == d[0].mgr_id) {
      this.setState(() => ({
        doneData : n,
      }), () => {
        this.modalToggle2();
      });
    }
    else {
      alert("팀장만 완료 요청이 가능합니다.");
    }
  };




  modalToggle() {
    this.setState({
      modal: !this.state.modal,

    });
  }
  modalToggle2() {
    this.setState({
      modal2: !this.state.modal2,

    });
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  setSelectedUser(e,n) {
    this.setState({
      selectedUser: n,
    })
  }

  componentDidMount() {
    this.getTable();
  }

  parsingData(array) {
    let ct = 0;
    let parsedArray = [];
    let parsedjson = '';
    let grade = 0;
    let reqlang = [];
    let reqscore = [];
    let requirement = [];
    let request_doc = '';
    let lanjson = '';
    for(let i=0;i<array[0].length;i++) {
      requirement = [];
      for(let j=0;j<array[1].length;j++) {
        if(array[0][i].id == array[1][j].request_id) {
          lanjson = [array[1][j].type,array[1][j].level];
          requirement.push(lanjson);
        }
      }
      for(let k=0;k<array[2].length;k++) {
        if(array[0][i].id == array[2][k].request_id) {
          request_doc = array[2][k].file_location;
          break;
        }
      }
      parsedjson = {
        id: array[0][i].id,
        title: array[0][i].title,
        money: array[0][i].money,
        start_date: array[0][i].start_date,
        end_date: array[0][i].end_date,
        requirement: requirement,
        request_doc: request_doc,
        people_min: array[0][i].people_min,
        people_max: array[0][i].people_max,
        career: array[0][i].career,
        team_id: array[0][i].team_id,
        status: array[0][i].status,
        client_id: array[0][i].client_id,
        pending: array[0][i].pending,
      }
      parsedArray.push(parsedjson);
    }

    this.setState({
      data: parsedArray,
    });
  }

  getTable = async () => {
    const index = this.state.index;
    const uid = this.state.uid;
    let f = true;
    const d = await service.getRequestClient(uid, index).then(r => {
      return r.data;
    })
    .catch(e => {
      f = false;
      //alert(e.response.data.message);
      return [];
    });

    if(f) this.parsingData(d);
  };

  setTeam = async (e,tid) => {
    const d = await service.getTeamName(tid).then(r => {
      return r.data;
    })
    .catch(e => {
      f = false;
      //alert(e.response.data.message);
      return [];
    });
    this.setState({
      setTeam: d[0].name,
    });
  }

  teamModalToggle(e) {
    this.setState({
      teamModal: !this.state.teamModal,
    });
  }

  viewfile = (event,file_location) => {
    window.location = "/" + file_location;
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <Apply modal={this.state.modal} uid={this.state.uid} rid={this.state.rid} requirement={this.state.requirement} pmax={this.state.pmax} pmin={this.state.pmin} career={this.state.career} toggle={e => this.modalToggle(e)}/>
        <Done modal={this.state.modal2} data={this.state.doneData} toggle={e => this.modalToggle2(e)}/>
        <TeamModal modal={this.state.teamModal} id={this.state.setTeam} toggle={(e) =>this.teamModalToggle(e)}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <MyRequestHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >

                      <TableCell component="th" scope="row" padding="dense">
                        {n.id}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="dense">
                        {n.title}
                      </TableCell>
                      <TableCell>{n.money}</TableCell>
                      <TableCell>{n.start_date}</TableCell>
                      <TableCell>{n.end_date}</TableCell>
                      <TableCell>
                      {n.requirement.map((l,i) => {
                        return (
                          <p>{l}</p>
                        )
                      })}
                      </TableCell>
                      <TableCell>{n.people_min} ~ {n.people_max}명</TableCell>
                      <TableCell>{n.career}년</TableCell>
                      <TableCell>
                      <Button color="secondary" style={buttonProducerStyle}
                        onClick={e => this.viewfile(e,n.request_doc)}
                        variant="contained"
                        fullWidth
                      >스펙 문서
                      </Button>
                      </TableCell>
                      <TableCell>{n.team_id !== null ? (
                        <Button variant="contained" color="primary" style={buttonProducerStyle} onClick={e => {
                          this.setTeam(e,n.team_id);
                          this.teamModalToggle(e);
                        }}> 팀 정보 </Button>
                      ):(
                        <p>없음</p>
                      )}</TableCell>
                      <TableCell>
                        {(() => {
                          if(this.state.index === 0) {
                            return (<Button variant="contained" color="primary"
                            style={buttonProducerStyle} onClick={(e) =>
                              {this.setStateData(e, this.state.uid, n.id, n.requirement, n.people_max, n.people_min, n.career);
                              }}> 신청 </Button>)
                          }
                          else if((this.state.index === 1) && (n.pending !== 2)) {
                            return (
                                <Button variant="contained" color="error" style={buttonProducerStyle}
                                onClick={(e) => {
                                  this.setStateData2(e, n);
                                }}
                                > 완료신청 </Button>
                            )
                          }
                          else if(this.state.index === 1) {
                            return (
                              <p>완료신청 대기중</p>
                            )
                          }
                          else if(this.state.index === 2) {
                            return (<p>수락 전</p>)
                          }

                        })()}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

MyRequest.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyRequest);
