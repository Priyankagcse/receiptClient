import { AppBar, Button, Dialog, DialogActions, DialogTitle, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import { history } from "src/helper/history";
import { loginAction } from "src/pages/login/login-reducer";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { ButtonView } from "./button-view";

function AppBarList(props: any) {

    const [state, setState] = React.useState({isConfirm: false});

    const handleChange = (field: any, value: any) => {
        setState(prevState => ({
            ...prevState,
            [field]: value
        }));
    }

    return (<div className="a-appbar">
        <AppBar position="static">
            <Toolbar className="pe-0">
                <Typography variant="h6">Money Track</Typography>
                <div className="flex-grow-1"></div>
                <ButtonView color="inherit" className={'align-items-end justify-content-end'} onClick={() => {
                    handleChange('isConfirm', true);
                }} startIcon={<PowerSettingsNewIcon></PowerSettingsNewIcon>}>
                    <span className="d-none d-sm-block">Hi Logout</span>
                </ButtonView>
            </Toolbar>
        </AppBar>
        <Dialog open={state.isConfirm} onClose={() => handleChange('isConfirm', false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{"Do you want to Signout?"}</DialogTitle>
            <DialogActions>
                <Button onClick={() => {
                    sessionStorage.removeItem('accessToken');
                    sessionStorage.removeItem('userUuid');
                    props.dispatch(loginAction.logoutRequest());
                    history.push('/login');
                }} className="text-primary">Ok</Button>
                <Button onClick={() => handleChange('isConfirm', false)} autoFocus>Cancel</Button>
            </DialogActions>
        </Dialog>
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