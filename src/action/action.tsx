import Axios from "axios";
import { addCreatedBy, addModifyedBy } from "src/common";
import { alertAction } from "src/pages/alert/alert-reducer";
import { progressAction } from "src/pages/progress/progress-reducer";

export const apiActions = {
    loginAction: loginAction,
    methodAction: methodAction
};

function loginAction(succ?: any, fail?: any) {
    Axios.get(`https://api.ipify.org/?format=json/get`).then((result) => {
        succ && succ(result);
    }, (error) => {
        fail && fail(error);
    });
}

function methodAction(method: string, url: any, obj: any, succ?: any, fail?: any) {
    return (dispatch: any, getState: any) => {
        dispatch(progressAction.show());
        let requestObj = obj;
        if (method === 'post') {
            addCreatedBy(requestObj);
        } else if (method === 'put') {
            addModifyedBy(requestObj);
        }
        Axios({
            method: method,
            url: url,
            data: requestObj
        }).then((result) => {
            succ && succ(result.data);
            dispatch(progressAction.hide());
        }, (error) => {
            let errMessage = error.response.data.message || 'Please Check the API';
            dispatch(alertAction.error(errMessage));
            dispatch(progressAction.hide());
            fail && fail();
        });
    };
}