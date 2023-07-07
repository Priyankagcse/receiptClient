export let defaultValue = {
    loggingIn: false,
    userLists: [] as any,
    loginCurrentUser: {},
    isHomeToLogin: false
};

export interface IUser {
    loggingIn: boolean;
    userLists: object[];
    loginCurrentUser: object;
    isHomeToLogin: boolean;
}

export interface IUserAct {
    type: string;
    value: object;
}

export const loginConstants = {
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGOUT_REQUEST: 'LOGOUT_REQUEST',
    LOGIN_USER_LIST: 'LOGIN_USER_LIST',
    LOGIN_CURRENT_USER: 'LOGIN_CURRENT_USER',
    HOME_TO_LOGIN: 'HOME_TO_LOGIN'
};

export const loginAction = {
    loginRequest: loginRequest,
    logoutRequest: logoutRequest,
    loginUserList: loginUserList,
    loginCurrentUser: loginCurrentUser,
    homeToLogin: homeToLogin
};

function loginRequest() {
    return { type: loginConstants.LOGIN_REQUEST };
}

function logoutRequest() {
    return { type: loginConstants.LOGOUT_REQUEST };
}

function loginUserList(value: any) {
    return { type: loginConstants.LOGIN_USER_LIST, value: value };
}

function loginCurrentUser(value: any) {
    return { type: loginConstants.LOGIN_CURRENT_USER, value: value };
}

function homeToLogin(value: any) {
    return { type: loginConstants.HOME_TO_LOGIN, value: value };
}

export function loginUser(state: IUser = defaultValue, action: IUserAct) {
    switch (action.type) {
        case loginConstants.LOGIN_REQUEST:
            return { ...state, loggingIn: true };
        case loginConstants.LOGOUT_REQUEST:
            return { ...state, loggingIn: false };
        case loginConstants.LOGIN_USER_LIST:
            return { ...state, userLists: action.value };
        case loginConstants.LOGIN_CURRENT_USER:
            return { ...state, loginCurrentUser: action.value };
        case loginConstants.HOME_TO_LOGIN:
            return { ...state, isHomeToLogin: action.value };
        default:
            return state;
    }
}