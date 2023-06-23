import React, { useEffect } from "react";
import { Route, Router, Switch } from "react-router-dom";
import { history } from "../../helper/history";
import { HomePageView } from "../homepage-view";
import { LoginPage } from "./login-view";
import { HomeRouter } from "../../initialload/router";
import { menuListAction } from "../menulists/menulists-reducer";
import { loginAction } from "./login-reducer";
import { RegisterView } from "./register-view";
import { ForgotPasswordView } from "./forgotpassword-view";
import { MenuPageView } from "../menulists/menus-view";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { apiActions } from "src/action/action";
import { COMMONAPI } from "src/apiurl";
import { version } from "src/version";
import { commonAction } from "src/common-reducer";

function SigninPage(props: any) {

    useEffect(() => {
        let accessToken: string = sessionStorage.getItem('accessToken');
        let userUuid: string = sessionStorage.getItem('userUuid');
        props.dispatch(apiActions.methodAction('get', COMMONAPI(version, userUuid).VERSIONREFRESH, {}, (result: any) => {
            props.dispatch(loginAction.loginUserList(result.userList));
            props.dispatch(menuListAction.getMenuList(result.menuList));
            props.dispatch(commonAction.spentType(result.spentType));
            props.dispatch(commonAction.transferType(result.transferType));
            let userObj = result.userList.filter((line: any) => line.uuid === userUuid);
            props.dispatch(loginAction.loginCurrentUser(userObj[0] || {}));
        }));
        if (accessToken && userUuid) {
            let pathname = window.location.pathname;
            props.dispatch(loginAction.loginRequest());
            history.push(pathname);
        } else {
            history.push('/login');
        }
    }, []);

    return (<>
        <Router history={history}>
            {props.loggingIn ?
                <React.Fragment>
                    <Switch>
                        <Route path="/home/:anyLink" component={HomeRouter} />
                        <Route path="/home" component={HomePageView} />
                        <Route path="/menu" component={MenuPageView} />
                    </Switch>
                </React.Fragment> :
                <React.Fragment>
                    <Switch>
                        <Route path="/login" component={LoginPage} />
                        <Route path="/register" component={RegisterView} />
                        <Route path="/forgotpassword" component={ForgotPasswordView} />
                    </Switch>
                </React.Fragment>}
        </Router>
    </>);
}

const mapStateToProps = function(state: IState) {
    return {
        loggingIn: state.loginUser.loggingIn,
        isMenuSelect: state.menuList.isMenuSelect,
        userLists: state.loginUser.userLists,
        menus: state.menuList.menus,
        loginCurrentUser: state.loginUser.loginCurrentUser,
    };
};

const mapDispatchToProps = function(dispatch: Dispatch) {
    return {
        dispatch: dispatch
    };
};

export const SigninPageView = connect(mapStateToProps, mapDispatchToProps)(SigninPage);
