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
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import * as service from '../../services/post';
import UserDetail from './UserDetail';
import axios from 'axios';




function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;3
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
  { id: 'user_id', numeric: false, disablePadding: true, label: 'User id' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'userType', numeric: false, disablePadding: false, label: 'Type' },
  { id: 'phone', numeric: false, disablePadding: false, label: 'Phone' },
  { id: 'grade', numeric: false, disablePadding: false, label: 'Grade' },
];

class AllUserHead extends React.Component {
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

AllUserHead.propTypes = {
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

let AllUserToolbar = props => {
  const { numSelected, classes, selectedDel } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            All Users
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <div onClick={selectedDel}>
          <Tooltip title="Delete">

              <IconButton aria-label="Delete" >
                <DeleteIcon />
              </IconButton>

          </Tooltip>
          </div>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

AllUserToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

AllUserToolbar = withStyles(toolbarStyles)(AllUserToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class AllUser extends React.Component {
  state = {
    order: 'desc',
    orderBy: 'id',
    selected: [],
    data: [],
    tableData: [{
      user_id: 'null',
      password: 'null',
      name: 'null',
      phone: 'null',
      userType: 'null',
      grade_sum: 'null',
      request_count: 'null',
    }],
    selectedUser: [],
    isOpen: false,
    modal: false,
    page: 0,
    rowsPerPage: 5,
  };

  modalToggle() {
    this.setState({
      modal: !this.state.modal
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
    let type = 0;
    let phone = '';

    let tid = 0;

    for(let i=0;i<array[0].length;i++) {
      grade = 0;
      type = 'ADMIN';
      phone = '0';
      parsedjson = {
        tid: tid,
        id: array[0][i].id,
        user_id: array[0][i].user_id,
        name: array[0][i].name,
        password: array[0][i].password,
        userType: type,
        phone: phone,
        grade: grade,
        disabled: true,
      }
      tid += 1;
      parsedArray.push(parsedjson);
    }

    for(let k=1;k<3;k++) {
      for(let i=0;i<array[k].length;i++) {
        let disabled = false;
        if(k == 1) {
          for(let j=0;j<array[3].length;j++) {
            if(j == 0) {
              let twice = 0;
              for(let h=0;h<array[3][j].length;h++) {
                if(array[k][i].id == array[3][j][h].fid) {
                  twice += 1;
                  if(twice >= 2) {
                    disabled = true;
                    break;
                  }
                }
              }
            }
            else {
              for(let h=0;h<array[3][j].length;h++) {
                if(array[k][i].id == array[3][j][h].fid) {
                  disabled = true;
                  break;
                }
              }
            }
          }
        }
        if(array[k][i].grade_sum == 0 | array[k][i].request_count == 0) grade = 0;
        else grade = array[k][i].grade_sum/array[k][i].request_count;
        if(k == 1) type = 'FREELANCER';
        else type = 'CLIENT';
        parsedjson = {
          tid: tid,
          id: array[k][i].id,
          user_id: array[k][i].user_id,
          name: array[k][i].name,
          password: array[k][i].password,
          userType: type,
          phone: array[k][i].phone,
          grade: grade,
          disabled: disabled,
        }
        tid += 1;
        parsedArray.push(parsedjson);
      }
    }
    this.setState({
      data: parsedArray,
    });
  }

  getTable = async () => {
    const d = await service.getTable().then(r => {
      return r.data;
    })
    .catch(e => {
      alert(e.response.data.message);
      return [];
    });

    this.parsingData(d);
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

  handleClick = (event, tid) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(tid);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, tid);
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

  selectedDel = event => {
    let idArr = [];
    let T = [];
    let F = false;
    for(let k=0;k<this.state.selected.length;k++) {
      for(let i=0;i<this.state.data.length;i++) {
        if(this.state.data[i].tid == this.state.selected[k]) {
          if(this.state.data[i].userType == "ADMIN") F = true;
          else if (this.state.data[i].userType == "FREELANCER") T.push(2);
          else if (this.state.data[i].userType == "CLIENT") T.push(3);
          else F = true;
          idArr.push(this.state.data[i].id);
        }
      }
    }
    if(F) alert("삭제할 수 없습니다");
    else {
      service.deleteUser(idArr,T);

    }
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <AllUserToolbar numSelected={selected.length} selectedDel={e => this.selectedDel(e)}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <AllUserHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <UserDetail modal={this.state.modal} toggle={e =>this.modalToggle(e)} data={this.state.selectedUser}/>
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.tid);
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.tid}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        {n.disabled ? (
                          <Checkbox disabled={true}/>
                        ):(
                          <Checkbox checked={isSelected} onClick={event => this.handleClick(event, n.tid)}/>
                        )}

                      </TableCell>
                      <TableCell component="th" scope="row" padding="none" onClick={e => {
                        this.setSelectedUser(e,n);
                        this.modalToggle(e);
                        }
                      }>
                        {n.user_id}
                      </TableCell>
                      <TableCell>{n.name}</TableCell>
                      <TableCell>{n.userType}</TableCell>
                      <TableCell>{n.phone}</TableCell>
                      <TableCell>{n.grade}</TableCell>
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

AllUser.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllUser);
