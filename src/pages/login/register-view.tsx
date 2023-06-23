import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { apiActions } from "src/action/action";
import { TextFieldView } from "src/component/textfield-view";
import { Browser } from "src/helper/browser";
import { history } from "src/helper/history";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { loginAction } from "./login-reducer";
import { emailValidate, encryptedData, isNullOrUndefinedOrEmpty, mobileValidate, passwordValidate } from "src/common";
import { alertAction } from "../alert/alert-reducer";
import { USERAPI } from "src/apiurl";
import { ButtonView } from "src/component/button-view";

function Register(props: any) {

    const [state, setState] = React.useState({username: '', password: '', phoneNumber: '', email: ''});
    const handleChange = (field: any, value: any) => {
        setState((prevState: any) => ({
            ...prevState,
            [field]: value
        }));
    };

    const onBlur = (event: any, field: any, value: any) => {
        if (value) {
            if (field === 'username') {
                let alreadyPresent = props.userLists.filter((line: any) => line.username === value);
                if (alreadyPresent.length) {
                    props.dispatch(alertAction.error('Username Already Present'));
                    event.target.focus();
                }
            } else if (field === 'password') {
                if (passwordValidate(value)) {
                    props.dispatch(alertAction.error('Password Must be One Special Character and One Small and One Capital and One Number'));
                    event.target.focus();
                }
            } else if (field === 'phoneNumber') {
                let alreadyPresent = props.userLists.filter((line: any) => line.phoneNumber === value);
                if (alreadyPresent.length) {
                    props.dispatch(alertAction.error('PhoneNumber Already Present'));
                    event.target.focus();
                } else if (mobileValidate(value)) {
                    props.dispatch(alertAction.error('PhoneNumber is Invaild'));
                    event.target.focus();
                }
            } else if (field === 'email') {
                let alreadyPresent = props.userLists.filter((line: any) => line.email === value);
                if (alreadyPresent.length) {
                    props.dispatch(alertAction.error('Email Already Present'));
                    event.target.focus();
                } else if (emailValidate(value)) {
                    props.dispatch(alertAction.error('Email is Invaild'));
                    event.target.focus();
                }
            }
        }
    };

    const submit = () => {
        let userPresent = props.userLists.filter((line: any) => line.username === state.username);
        let phoneNumberPresent = props.userLists.filter((line: any) => line.phoneNumber === state.phoneNumber);
        let emailPresent = props.userLists.filter((line: any) => line.email === state.email);
        if (userPresent.length) {
            props.dispatch(alertAction.error('Username Already Present'));
        } else if (passwordValidate(state.password)) {
            props.dispatch(alertAction.error('Password Must be One Special Character and One Small and One Capital and One Number and Length Min 8 to 15'));
        } else if (phoneNumberPresent.length) {
            props.dispatch(alertAction.error('PhoneNumber Already Present'));
        } else if (mobileValidate(state.phoneNumber)) {
            props.dispatch(alertAction.error('PhoneNumber is Invaild'));
        } else if (emailPresent.length) {
            props.dispatch(alertAction.error('Email Already Present'));
        } else if (emailValidate(state.email)) {
            props.dispatch(alertAction.error('Email is Invaild'));
        } else if (isNullOrUndefinedOrEmpty(state.username) || isNullOrUndefinedOrEmpty(state.password) ||
            isNullOrUndefinedOrEmpty(state.phoneNumber) || isNullOrUndefinedOrEmpty(state.email)) {
            props.dispatch(alertAction.error('All the Fields are must be fill'));
        } else {
            let postData = {username: state.username, password: encryptedData(state.password), phoneNumber: state.phoneNumber, email: state.email};
            props.dispatch(apiActions.methodAction('post', USERAPI().POST, postData, (res: any) => {
                let userLists = props.userLists.concat([res.data]);
                props.dispatch(loginAction.loginUserList(userLists));
                history.push('/login');
            }));
        }
    };

    return (<>
        <div className={Browser.isDeviceScreen ? "col-12 p-3" : "a-center-align"}>
            <form action="" autoComplete="off" className="col-12 col-sm-3">
                <div className="headingsContainer">
                    <h3 align="center">Sign Up</h3>
                </div>
                <div className="mainContainer">
                    <TextFieldView label="Username" type={'text'} field={'username'} className={'col-12 col-sm-12'} required
                        onChange={handleChange} value={state.username} onBlur={onBlur} />
                    <br /><br />
                    <TextFieldView label="Password" type={'password'} field={'password'} className={'col-12 col-sm-12'} required
                        onChange={handleChange} value={state.password} placeholder={'Aa@12345'} onBlur={onBlur} />
                    <br /><br />
                    <TextFieldView label="Phone Number" type={'number'} field={'phoneNumber'} className={'col-12 col-sm-12'} required
                        onChange={handleChange} value={state.phoneNumber} inputProps={{maxLength: 10}} onBlur={onBlur} placeholder={'9874563210'} />
                    <br /><br />
                    <TextFieldView label="Email" type={'email'} field={'email'} className={'col-12 col-sm-12'} required
                        onChange={handleChange} value={state.email} onBlur={onBlur} onKeyDown={(event: any) => {
                            if (event.keyCode === 13) {
                                submit();
                            }
                        }} placeholder={'abc@gmail.com'} />
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

const mapDispatchToProps = function(dispatch: Dispatch) {
    return {
        dispatch: dispatch
    };
};

export const RegisterView = connect(mapStateToProps, mapDispatchToProps)(Register);