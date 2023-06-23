import React from "react";
import { SigninPageView } from "./login/signin-view";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { AlertPage } from "./alert/alertpage-view";
import { ProgressView } from "./progress/progress-view";
import { alertAction } from "./alert/alert-reducer";

function ClientApp(props: any) {
    return (<>
        <AlertPage
            onClose={() => props.dispatch(alertAction.clear())}
            open={props.message}
            autoHideDuration={3000}
            message={props.message}
        />
        <ProgressView isProgress={props.isProgress}></ProgressView>
        <div className={props.isProgress ? "a-opacity-disable h-100" : "h-100"}>
            <SigninPageView></SigninPageView>
        </div>
    </>);
}

const mapStateToProps = function(state: IState) {
    return {
        message: state.alertReducer.message,
        isProgress: state.progress.isProgress
    };
};

const mapDispatchToProps = function(dispatch: Dispatch) {
    return {
        dispatch: dispatch
    };
};

export const ClientAppView = connect(mapStateToProps, mapDispatchToProps)(ClientApp);