import React, { Component } from 'react';
import { BrowserRouter as  Router, Route, Redirect, Switch } from "react-router-dom";
import {StaticData} from '../Events/staticComponent'
import {TEIDetails} from '../Events/TEI'
class Main extends Component {
    render() {
        return (
        <Router>
            <Switch>
            <Route path="/trackedEntityInstances" component={TEIDetails} />
            <Route path = "/"  component = {StaticData} />
            <Redirect to="/"  component={StaticData} /> 
            </Switch> 
        </Router>
        );
    }
}
export default Main;