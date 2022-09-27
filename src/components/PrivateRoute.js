import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { checkUserRole } from '../apis/auth';
import { getCookie, decodeCookieData, resetCookie } from '../utils/auth';

const PrivateRoute = ({ history, component: Component, path, ...rest }) => {
    let cookieData = getCookie('key');
    let loginData;

    if (cookieData) {
        loginData = decodeCookieData(cookieData);
    }

    if (loginData) {
        checkUserRole(loginData.accessToken)
            .then((res) => {
                if (!res.data) {
                    resetCookie();
                    history.push('/login');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const render = (props) => <Component {...props} />;

    return loginData && loginData.isLoggedIn ? (
        <Route path={path} render={render} {...rest} />
    ) : (
        <Redirect to={{ pathname: '/login' }} />
    );
};

export default withRouter(PrivateRoute);
