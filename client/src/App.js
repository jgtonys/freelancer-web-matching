import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Home, Checkout, Signup, Test } from './pages';
import { MypageTabs } from './pages/mypage';
import { Header } from './components';


class App extends Component{
   render(){
      return(
        <div>
          <Header/>
          <Route exact path="/" component={Home}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/Checkout" component={Checkout}/>
          <Route path="/test" component={Test}/>
          <Route path="/mypage" component={MypageTabs}/>
        </div>
      );
   }
}
export default App;
