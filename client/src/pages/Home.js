import React from 'react';
import Mainpage from './MainPage';
import AdminTabs from './admin/AdminTabs';
import ClientTabs from './client/ClientTabs';
import FreelancerTabs from './freelancer/FreelancerTabs';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      modal: false,
      isLogin: window.sessionStorage.getItem('user'),
      userType: window.sessionStorage.getItem('userType'),
    };
  }
  render() {
    const isLoggedIn = this.state.isLogin;
    const userType = this.state.userType;
    let userRendering = null;

    if(userType == "ADMIN") { // admin
      userRendering = <AdminTabs />;
    }
    else if(userType == "FREELANCER"){
      userRendering = <FreelancerTabs />;
    }
    else if(userType == "CLIENT"){
      userRendering = <ClientTabs />;
    }
    else {
      userRendering = <Mainpage />;
    }
    return (
        <div>
          {userRendering}
        </div>
    );
  }
};

export default Home;
