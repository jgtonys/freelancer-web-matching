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
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import * as service from '../../services/post';
import { Document, Page } from 'react-pdf/dist/entry.webpack';

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


class ExtPortfolio extends React.Component {
  state = {
    title: '',
    file_location: '',
    numPages: null,
    pageNumber: 1,
    portchange: false,
    uid: window.sessionStorage.getItem('uid'),
  };

  componentDidMount() {
    this.getTable();
  }

  portchange() {
    this.setState({
      portchange: !this.state.portchange,
    })
  }

  getTable = async () => {
    const uid = window.sessionStorage.getItem('uid');
    let f = true;
    const d = await service.getMyExtPortfolio(uid).then(r => {
      return r.data;
    })
    .catch(e => {
      f = false;
      console.log(e.response.data.message);
      return [];
    });
    this.setState({
      title: d[0].title,
      file_location: d[0].file_location,
    })
  }

  updatePort = event => {
    event.preventDefault();
    const data = new FormData(event.target);
    data.append('uid',this.state.uid);
    service.updatePortfolio(data);
  }

  viewfile = event => {
    window.location = "/" + this.state.file_location;
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  render() {
    const { pageNumber, numPages } = this.state;

    return (
      <div>
      {!this.state.portchange ? (
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <Button fullWidth>{this.state.title}</Button>
          </Grid>
          <Grid item xs={4}>
            <Button color="secondary" onClick={e => this.viewfile(e)} variant="contained" fullWidth>다운로드</Button>
          </Grid>
          <Grid item xs={4}>
            <Button color="primary" onClick={e => this.portchange(e)} variant="contained" fullWidth>변경</Button>
          </Grid>
        </Grid>
      ) : (
        <form onSubmit={this.updatePort}>
          <Grid container spacing={24}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <input type="file" name="userPortfolio" id="userPortfolio" />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
              포트폴리오 수정하기
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button color="primary" onClick={e => this.portchange(e)} variant="contained" fullWidth>취소</Button>
            </Grid>
          </Grid>
        </form>
      )}
        <Document
          file={this.state.file_location}
          onLoadSuccess={this.onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
    );
  }
}

ExtPortfolio.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles,{ withTheme: true })(ExtPortfolio);
