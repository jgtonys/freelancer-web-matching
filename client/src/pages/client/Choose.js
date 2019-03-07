import React, { Component} from 'react';
import * as service from '../../services/post';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
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
import TeamDetail from './TeamDetail'

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
  { id: 'team_name', numeric: false, disablePadding: false, label: '팀 이름' },
  { id: 'money', numeric: false, disablePadding: false, label: '최소 경력' },
  { id: 'start_date', numeric: false, disablePadding: false, label: '평점' },
  { id: 'requirement', numeric: false, disablePadding: false, label: '팀 언어 능력' },
];




class ChooseHead extends React.Component {


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

ChooseHead.propTypes = {
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

let ChooseToolbar = props => {
  const { numSelected, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.spacer} />
      <div className={classes.actions}>
      </div>
    </Toolbar>
  );
};

ChooseToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

ChooseToolbar = withStyles(toolbarStyles)(ChooseToolbar);

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

class Choose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requestId : this.props.match.params.id,
      order: 'asc',
      orderBy: 'calories',
      selected: [],
      data: [],
      selectedTeam: [],
      selectedTeamMember: [],
      selectedTeamLang: [],
      isOpen: false,
      modal: false,
      page: 0,
      rowsPerPage: 5,
    };
  }

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

  setSelectedTeam(e,row) {
    let n = row.member;
    let ids = [];
    let free_info = [];
    let parselang = [];
    let free_lang = [];
    for(var i=0;i<n.length;i++) {
      if(ids.indexOf(n[i].id) == -1) {
        ids.push(n[i].id);
        free_info.push(n[i]);
        free_lang.push(n[i].type+n[i].level);
      }
      else {
        free_lang[ids.indexOf(n[i].id)] += ',' + n[i].type + n[i].level;
      }
    }
    this.setState({
      selectedTeam: row,
      selectedTeamMember: free_info,
      selectedTeamLang: free_lang,
    })
  }

  componentDidMount() {
    this.getTable();
  }

  parsingData(array) {
    let ids = [];
    let min_career = [];
    let mgr_id = [];
    let name = [];
    let type = [];
    let max_level = [];
    let member = [];
    let totalscore = [];
    for(var i=0;i<array[0].length;i++) {
      if(ids.indexOf(array[0][i].id) == -1) {
        ids.push(array[0][i].id);
        min_career.push(array[0][i].min_career);
        mgr_id.push(array[0][i].mgr_id);
        name.push(array[0][i].name);
        type.push(array[0][i].type + array[0][i].max_level);
        member.push([]);
        totalscore.push(0);
      }
      else {
        type[ids.indexOf(array[0][i].id)] += ',' + array[0][i].type +array[0][i].max_level;
      }
    }
    let m = 0;
    for(var i=0;i<array[1].length;i++) {
      m = ids.indexOf(array[1][i].team_id);
      member[m].push(array[1][i]);
    }
    let free_ids = [];
    let tmp_sum = 0;
    let tmp_ct = 0;
    for(var i=0;i<ids.length;i++) {
      tmp_sum = 0;
      tmp_ct = 0;
      free_ids = [];
      for(var j=0;j<member[i].length;j++) {
        if(member[i][j].request_count != 0 && member[i][j].grade_sum != 0) {
          if(free_ids.indexOf(member[i][j].id) == -1) {
            free_ids.push(member[i][j].id);
            tmp_sum += (member[i][j].grade_sum / member[i][j].request_count);
            tmp_ct += 1;
          }
        }
      }
      if(tmp_sum == 0 || tmp_ct == 0) totalscore[i] = 0;
      else totalscore[i] = (tmp_sum / tmp_ct).toFixed(2);
    }
    let parsedArray = [];
    let jsonData = '';
    for(var i=0;i<ids.length;i++) {
      jsonData = {
        team_id: ids[i],
        name: name[i],
        min_career: min_career[i],
        score: totalscore[i],
        portfolio: "none",
        member: member[i],
        mgr_id: mgr_id[i],
        type: type[i],
      }
      parsedArray.push(jsonData);
    }

    this.setState({
      data: parsedArray,
    });
  }

  getTable = async () => {
    let f = true;
    const d = await service.getRequestTeamTable(this.state.requestId).then(r => {
      return r.data;
    })
    .catch(e => {
      f = false;
      console.log(e.response.data.message);
      return [];
    });

    if(f) this.parsingData(d);
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
      <h2>의뢰 팀 선택</h2>
      <TeamDetail modal={this.state.modal} toggle={(e) =>this.modalToggle(e)} data={this.state.selectedTeam} mem={this.state.selectedTeamMember} rid={this.state.requestId} fl={this.state.selectedTeamLang}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <ChooseHead
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
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={n.id}
                      onClick={(e) => {
                        this.setSelectedTeam(e,n);
                        this.modalToggle(e);
                      }}
                    >
                      <TableCell component="th" scope="row" padding="dense">
                        {n.name}
                      </TableCell>
                      <TableCell>{n.min_career}년</TableCell>
                      <TableCell>{n.score}점</TableCell>
                      <TableCell>{n.type}</TableCell>
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

Choose.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Choose);



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
