import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import TeamList from './TeamList';
import IntPortfolio from './IntPortfolio';
import ExtPortfolio from './ExtPortfolio';
import ModifyUser from './ModifyUser';


function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
});

class MypageTabs extends React.Component {
  state = {
    value: 0,
    userType: window.sessionStorage.getItem('userType')
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          {this.state.userType === "FREELANCER" ? (
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
            >
            <Tab label="팀 리스트" />
            <Tab label="회원정보 수정" />
            <Tab label="내적 포트폴리오" />
            <Tab label="외적 포트폴리오" />
            </Tabs>
          ) : (
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
            >
            <Tab label="회원정보 수정" />
            </Tabs>
          )}
        </AppBar>

        {this.state.userType === "FREELANCER" ? (
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
          >
            <TabContainer dir={theme.direction}><TeamList /></TabContainer>
            <TabContainer dir={theme.direction}><ModifyUser /></TabContainer>
            <TabContainer dir={theme.direction}><IntPortfolio /></TabContainer>
            <TabContainer dir={theme.direction}><ExtPortfolio /></TabContainer>
          </SwipeableViews>
        ) : (
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
          >
            <TabContainer dir={theme.direction}><ModifyUser /></TabContainer>
          </SwipeableViews>
        )}
      </div>
    );
  }
}

MypageTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MypageTabs);
