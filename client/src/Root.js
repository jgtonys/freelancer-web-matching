import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';


const Root = () => (
    <BrowserRouter>
        <App/>
    </BrowserRouter>
);

export default Root;
