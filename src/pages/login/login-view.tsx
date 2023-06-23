import React from "react";
import { connect } from "react-redux";
import { history } from "../../helper/history";
import { loginAction } from "./login-reducer";
import { IState } from "../../initialload/state-interface";
import { apiActions } from "src/action/action";
import { TextFieldView } from "src/component/textfield-view";
import { Link } from "react-router-dom";
import { Browser } from "src/helper/browser";
import { decryptData } from "src/common";
import { alertAction } from "../alert/alert-reducer";
import { USERAPI } from "src/apiurl";
import { commonAction } from "src/common-reducer";
import { ButtonView } from "src/component/button-view";

function LoginPageView(props: any) {

    const [state, setState] = React.useState({username: '', password: ''});
    const handleChange = (field: any, value: any) => {
        setState((prevState: any) => ({
            ...prevState,
            [field]: value
        }));
    };

    const submit = () => {
        let alreadyPresent = props.userLists.filter((line: any) => line.username === state.username &&
            decryptData(line.password) === state.password);
        if (alreadyPresent.length === 0) {
            props.dispatch(alertAction.error('Username and Password Mismatch'));
        } else {
            // apiActions.loginAction((info: any) => {
                props.dispatch(apiActions.methodAction('get', USERAPI(alreadyPresent[0]['uuid']).GETBYID, {}, (res: any) => {
                    sessionStorage.setItem('accessToken', '111222333');
                    sessionStorage.setItem('userUuid', alreadyPresent[0]['uuid']);
                    props.dispatch(loginAction.loginCurrentUser(res.data));
                    props.dispatch(commonAction.spentType(res.spentType));
                    props.dispatch(commonAction.transferType(res.transferType));
                    props.dispatch(loginAction.loginRequest());
                    history.push('\home');
                }));
            // }, () => {
            //     sessionStorage.setItem('accessToken', '111222333');
            //     sessionStorage.setItem('userUuid', alreadyPresent[0]['uuid']);
            // });
        }
    };
    
    return (<>
        <div className={Browser.isDeviceScreen ? "col-12 p-3" : "a-center-align"}>
            <form action="" autoComplete="off" className="col-12 col-sm-3">
                <div className="headingsContainer">
                    <h3 align="center">Sign in</h3>
                </div>
                <div className="mainContainer">
                    <TextFieldView label="Username" type={'text'} field={'username'} className={'col-12 col-sm-12'}
                        onChange={handleChange} value={state.username} />
                    <br /><br />
                    <TextFieldView label="Password" type={'password'} field={'password'} className={'col-12 col-sm-12'}
                        onChange={handleChange} value={state.password} onKeyDown={(event: any) => {
                            if (event.keyCode === 13) {
                                submit();
                            }
                        }} />
                    <br /><br />
                    <Link className={'text-decoration-none'} to={'/forgotpassword'}>Forgot password?</Link>
                    <br /><br />
                    <div className="row m-0">
                        <div className="col-6 col-sm-6 p-0">
                            <Link className={'text-decoration-none'} to={'/register'}>
                                <ButtonView variant="contained" color="primary">Sign Up</ButtonView>
                            </Link>
                        </div>
                        <div className="col-6 col-sm-6 p-0" align="right">
                            <ButtonView variant="contained" color="primary" onClick={() => submit()}>Login</ButtonView>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </>);
    
}

function mapStateToProps(state: IState) {
    return {
        loggingIn: state.loginUser.loggingIn,
        userLists: state.loginUser.userLists
    };
}

export const LoginPage = connect(mapStateToProps)(LoginPageView);