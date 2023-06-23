import React from "react";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Toolbar, Typography } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { TextFieldView } from "src/component/textfield-view";
import { apiActions } from "src/action/action";
import { alertAction } from "../alert/alert-reducer";
import { toLowerCaseNoSpace } from "src/common";
import { BANKAPI } from "src/apiurl";
import { ButtonView } from "src/component/button-view";

function BankDetails(props: any) {
    const [state, setState] = React.useState({bankName: '', bankDescription: '', isSimilar: false});
    const handleChange = (field: any, value: any) => {
        setState(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const bankDetailUpload = () => {
        let bankName = props.dropDownSource.filter((line: any) => toLowerCaseNoSpace(line.bankName) === toLowerCaseNoSpace(state.bankName));
        let similarName = props.dropDownSource.filter((line: any) => toLowerCaseNoSpace(line.bankName).includes(toLowerCaseNoSpace(state.bankName)));
        if (bankName.length) {
            props.dispatch(alertAction.error('Already this Bank Name is Present. So you can use the Same Bank Name'));
        } else if (!state.isSimilar && state.bankName.length >= 3 && similarName.length) {
            handleChange('isSimilar', true);
        } else {
            let postData = {
                bankName: state.bankName,
                description: state.bankDescription
            };
            props.dispatch(apiActions.methodAction('post', BANKAPI().POST, postData, (res: any) => {
                if (props.refresh) {
                    props.refresh(res);
                }
            }));
        }
    };
    
    return (<>
        <Dialog aria-labelledby="simple-dialog-title" open={true} className={'a-dialog-md'}>
            <DialogTitle id="simple-dialog-title" className="p-0">
                <Toolbar className="border-bottom bg-white">
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={props.onClose}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" className="flex-grow-1">Add Bank Details</Typography>
                    <div className="p-2" align='right'>
                        <ButtonView variant="contained" color="primary" onClick={() => bankDetailUpload()}>Save</ButtonView>
                    </div>
                </Toolbar>
            </DialogTitle>
            <DialogContent>
                <div className="col-sm-12 mb-4">
                    <TextFieldView label="Bank Name" type={'text'} field={'bankName'} className={'col-sm-12'}
                        value={state.bankName} onChange={handleChange} />
                </div>
                <div className="col-sm-12 mb-4">
                    <TextFieldView label="Description" className={'col-sm-12'} value={state.bankDescription}
                        onChange={handleChange} id="filled-multiline-static" multiline rows={4} type={'text'}
                        field={'bankDescription'} />
                </div>
            </DialogContent>
        </Dialog>
        <Dialog aria-labelledby="simple-dialog-title" open={state.isSimilar} className={'a-dialog-md'}>
            <DialogContent>
                This name contains already present Bank Name, Do you want to create or close?
            </DialogContent>
            <DialogActions>
                <ButtonView onClick={bankDetailUpload}>Create</ButtonView>
                <ButtonView onClick={() => handleChange('isSimilar', false)} autoFocus>Close</ButtonView>
            </DialogActions>
        </Dialog>
    </>);
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

export const BankDetailsView = connect(mapStateToProps, mapDispatchToProps)(BankDetails);