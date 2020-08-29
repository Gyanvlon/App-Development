import React, { useState } from 'react'
import { BrowserRouter } from "react-router-dom";
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
import Main from './components/mainComponent/mainComponent';
import store from './redux/store/store'
import { Provider } from 'react-redux'
import {MetaData} from './components/Events/metadata'
// const store = configStore();

const MyApp = () => { 
    return <> 
     <Provider store ={store}>
       {/* <BrowserRouter> */}
         <MetaData />
        <Main />
      {/* </BrowserRouter> */}
      </Provider>
    </>   
}
export default MyApp
