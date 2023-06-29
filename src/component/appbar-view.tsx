import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import { history } from "src/helper/history";
import { loginAction } from "src/pages/login/login-reducer";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { ButtonView } from "./button-view";

function AppBarList(props: any) {
    return (<div className="a-appbar">
        <AppBar position="static">
            <Toolbar className="pe-0">
                <Typography variant="h6">Money Track</Typography>
                <div className="flex-grow-1"></div>
                <ButtonView color="inherit" className={'align-items-end justify-content-end'} onClick={() => {
                    sessionStorage.removeItem('accessToken');
                    sessionStorage.removeItem('userUuid');
                    props.dispatch(loginAction.logoutRequest());
                    history.push('/login');
                }} startIcon={<PowerSettingsNewIcon></PowerSettingsNewIcon>}>
                    <span className="d-none d-sm-block">Logout</span>
                </ButtonView>
            </Toolbar>
        </AppBar>
    </div>);
}

const mapStateToProps = function(state: IState) {
    return {
        
    };
};

const mapDispatchToProps = function(dispatch: Dispatch) {
    return {
        dispatch: dispatch
    };
};

export const AppBarView = connect(mapStateToProps, mapDispatchToProps)(AppBarList);