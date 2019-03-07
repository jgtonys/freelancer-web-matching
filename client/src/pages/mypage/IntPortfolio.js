import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Divider from '@material-ui/core/Divider';
import AddTeam from './AddTeam'; ///////////////////
import * as service from '../../services/post';


const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
    position: 'relative',
    minHeight: 200,
  },
  fab: {
    margin: theme.spacing.unit,
  },
  media: {
    height: 140,
  },
  addbutton: {
    marginBottom: theme.spacing.unit * 5,
  }
});


class IntPortfolio extends React.Component {
  state = {
    intPortfolioList: [],
    languageList: [],
    modal: false,
  };

  modalToggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  componentDidMount() {
    this.getTable();
  }

  viewfile = (event, file_location) => {
    window.location = "/" + file_location;
  }

  getTable = async () => {
    const uid = window.sessionStorage.getItem('uid');
    let f = true;
    const d = await service.getIntPortfolio(uid).then(r => {
      return r.data;
    })
    .catch(e => {
      f = false;
      return [];
    });

    if(d.length > 0) this.parsingData(d);
  }

  parsingData(array) {
    let teamIdList = array[0];
    let requestList = array[1];
    let docList = array[2];
    let langList = array[3];
    let teamList = array[4];

    let resultArray = [];
    let langArray = [];
    for(let i = 0; i < requestList.length; i++) {
        let team_name = '';
        for(let j = 0; j < teamList.length; j++) {
            if(teamList[j].id == requestList[i].team_id) {
                team_name = teamList[j].name;
            }
        }
        let teamLangList = [];
        for(let j = 0; j < langList.length; j++) {
            if(langList[j].team_id == requestList[i].team_id) {
                teamLangList.push(langList[j]);
            }
        }
        let docLocation;
        for(let j = 0; j < docList.length; j++) {
            if(docList[j].request_id == requestList[i].id) {
                docLocation = docList[j].file_location;
                break;
            }
        }
        let resultJson = '';
        resultJson = {
            title: requestList[i].title,
            money: requestList[i].money,
            startDate: requestList[i].start_date,
            endDate: requestList[i].end_date,
            pMax: requestList[i].people_max,
            pMin: requestList[i].people_min,
            career: requestList[i].career,
            tName: team_name,
            doc: docLocation
        }
        resultArray.push(resultJson);
        langArray.push(teamLangList);
    }
    this.setState({
      intPortfolioList: resultArray,
      languageList: langArray,
    });
  }

  render() {
    const { classes, theme } = this.props;
    const transitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen,
    };

    const fab = {
        color: 'primary',
        className: classes.fab,
        icon: <AddIcon />,
    };

    return (
      <div>
      {this.state.intPortfolioList.map((request,i) => {
        return (
          <div>
          <Card className={classes.card}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {request.title}
                </Typography>
                <Typography component="p">
                  팀명 : {request.tName}
                </Typography>
                <Typography component="p">
                  금액 : {request.money}
                </Typography>
                <Typography component="p">
                  최소 커리어 : {request.career}
                </Typography>
                <Typography component="p">
                  최소 인원 : {request.pMin}
                </Typography>
                <Typography component="p">
                  최대 인원 : {request.pMax}
                </Typography>
                <Typography component="p">
                  시작 일자 : {request.startDate}
                </Typography>
                <Typography component="p">
                  종료 일자 : {request.endDate}
                </Typography>
                {this.state.languageList[i].map((lang,j) => {
                  return (
                    <Typography component="p">
                      {lang.type} : Level {lang.max_level}
                    </Typography>
                  )
                })}
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary"
              onClick={e => this.viewfile(e, request.doc)}>
              의뢰 문서
              </Button>
            </CardActions>
          </Card>
          <Divider variant="middle" />
          </div>
        )
      })}
      </div>
    );
  }
}

IntPortfolio.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles,{ withTheme: true })(IntPortfolio);
