import { combineReducers } from "redux";
import { commonReducer } from "src/common-reducer";
import { alertReducer } from "src/pages/alert/alert-reducer";
import { menuList } from "src/pages/menulists/menulists-reducer";
import { progress } from "src/pages/progress/progress-reducer";
import { loginUser } from "../pages/login/login-reducer";

export let rootReducer: any = combineReducers({
    loginUser: loginUser,
    menuList: menuList,
    alertReducer: alertReducer,
    progress: progress,
    commonReducer: commonReducer
});