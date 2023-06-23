import { AppBar, StepIcon, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import MenuIcon from '@material-ui/icons/Menu';
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { history } from "src/helper/history";
import { loginAction } from "src/pages/login/login-reducer";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { ButtonView } from "./button-view";

function AppBarList(props: any) {
    const [view, setView] = React.useState('dashboard');
    const handleChange = (event: any, nextView: any) => {
        setView(nextView);
    };

    return (<div className="a-appbar">
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">Money Track</Typography>
                <div className="flex-grow-1"></div>
                <ToggleButtonGroup value={view} onChange={handleChange} exclusive aria-label="text formatting">
                    <ToggleButton value="dashboard" aria-label="dashboard" onClick={() => history.push('/\home')}>
                        <StepIcon icon={"D"} />
                    </ToggleButton>
                    <ToggleButton value="menus" aria-label="menus" onClick={() => history.push('/\menu')}>
                        <MenuIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
                <div className="flex-grow-1"></div>
                <ButtonView color="inherit" onClick={() => {
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