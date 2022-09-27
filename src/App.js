import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';

import Login from './pages/Login';

import stores from '../src/stores';
import MainRouter from './MainRouter';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <Provider {...stores}>
            <Switch>
                <Route path="/login" component={Login} />
                <PrivateRoute path="/" component={MainRouter} />
            </Switch>
        </Provider>
    );
}

export default withRouter(App);
