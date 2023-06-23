import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { apiActions } from "src/action/action";
import { USERAPI } from "src/apiurl";
import { encryptedData, isNullOrUndefinedOrEmpty } from "src/common";
import { ButtonView } from "src/component/button-view";
import { TextFieldView } from "src/component/textfield-view";
import { Browser } from "src/helper/browser";
import { history } from "src/helper/history";
import { IState } from "src/initialload/state-interface";
import { alertAction } from "../alert/alert-reducer";
import { loginAction } from "./login-reducer";

function ForgotPassword(props: any) {

    const [state, setState] = React.useState({selecteData: {} as any, username: '', password: '', confirmPassword: ''});
    const handleChange = (field: any, value: any) => {
        setState((prevState: any) => ({
            ...prevState,
            [field]: value
        }));
    };

    const submit = () => {
        if (isNullOrUndefinedOrEmpty(state.selecteData.username)) {
            props.dispatch(alertAction.error('Username is Wrong'));
        } else if (state.password !== state.confirmPassword) {
            props.dispatch(alertAction.error('Password And ConfirmPassword Mismatch'));
        } else {
            let putData = {...state.selecteData, password: encryptedData(state.password)};
            props.dispatch(apiActions.methodAction('put', USERAPI().PUT, putData, (res: any) => {
                let userLists = props.userLists.map((line: any) => {
                    if (state.selecteData.uuid === line.uuid) {
                        return res.data;
                    }
                    return line;
                });
                props.dispatch(loginAction.loginUserList(userLists));
                history.push('/login');
            }));
        }
    };

    const onBlur = (event: any, field: any, value: any) => {
        if (value) {
            if (field === 'username') {
                let alreadyPresent = props.userLists.filter((line: any) => line.username === value);
                if (alreadyPresent.length === 0) {
                    props.dispatch(alertAction.error('Username is Wrong'));
                    event.target.focus();
                } else {
                    handleChange('selecteData', alreadyPresent[0] || {});
                }
            } else if (field === 'confirmPassword') {
                if (state.password !== value) {
                    props.dispatch(alertAction.error('Password And ConfirmPassword Mismatch'));
                    event.target.focus();
                }
            }
        }
    };
    
    return (<>
        <div className={Browser.isDeviceScreen ? "col-12 p-3" : "a-center-align"}>
            <form action="" autoComplete="off" className="col-12 col-sm-3">
                <div className="headingsContainer">
                    <h3 align="center">Forgot Password</h3>
                </div>
                <div className="mainContainer">
                    <TextFieldView label="Username" type={'text'} field={'username'} className={'col-12 col-sm-12'} required
                        onChange={handleChange} value={state.username} onBlur={onBlur} />
                    <br /><br />
                    <TextFieldView label="Password" type={'password'} field={'password'} className={'col-12 col-sm-12'} required
                        onChange={handleChange} value={state.password} />
                    <br /><br />
                    <TextFieldView label="Confirm Password" type={'password'} field={'confirmPassword'} className={'col-12 col-sm-12'} required
                        onChange={handleChange} value={state.confirmPassword} onBlur={onBlur} onKeyDown={(event: any) => {
                            if (event.keyCode === 13) {
                                submit();
                            }
                        }} />
                    <br /><br />
                    <div className="row m-0">
                        <div className="col-6 col-sm-6 p-0">
                            <Link className={'text-decoration-none'} to={'/login'}>
                                <ButtonView variant="contained" color="primary">Cancel</ButtonView>
                            </Link>
                        </div>
                        <div className="col-6 col-sm-6 p-0" align="right">
                            <ButtonView variant="contained" color="primary" onClick={() => submit()}>Save</ButtonView>
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

export const ForgotPasswordView = connect(mapStateToProps)(ForgotPassword);