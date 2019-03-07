import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Home, Signup } from './pages';
import { MypageTabs, Messages } from './pages/mypage';
import {Choose} from './pages/client';
import { Header } from './components';


class App extends Component{
   render(){
      return(
        <div>
          <Header/>
          <Route exact path="/" component={Home}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/mypage" component={MypageTabs}/>
          <Route path="/messages" component={Messages}/>
          <Route path="/choose/:id" component={Choose}/>
        </div>
      );
   }
}
export default App;
