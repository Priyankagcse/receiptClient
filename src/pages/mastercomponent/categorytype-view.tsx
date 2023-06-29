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
import { CATEGORYTYPEAPI } from "src/apiurl";
import { ButtonView } from "src/component/button-view";

function CategoryType(props: any) {
    const [state, setState] = React.useState({categoryTypeName: '', categoryDescription: '', dropDownSource: [], isSimilar: false});
    const handleChange = (field: any, value: any) => {
        setState(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const categoryUpload = () => {
        let categoryTypeName = props.dropDownSource.filter((line: any) =>
            toLowerCaseNoSpace(line.categoryTypeName) === toLowerCaseNoSpace(state.categoryTypeName));
        let similarName = props.dropDownSource.filter((line: any) =>
            toLowerCaseNoSpace(line.categoryTypeName).includes(toLowerCaseNoSpace(state.categoryTypeName)));
        if (categoryTypeName.length) {
            props.dispatch(alertAction.error('Already this Category Type is Present. So you can use the Same Category Type'));
        } else if (!state.isSimilar && state.categoryTypeName.length >= 3 && similarName.length) {
            handleChange('isSimilar', true);
        } else {
            let postData = {
                categoryTypeName: state.categoryTypeName,
                description: state.categoryDescription
            };
            props.dispatch(apiActions.methodAction('post', CATEGORYTYPEAPI().POST, postData, (res: any) => {
                if (props.refresh) {
                    props.refresh(res);
                }
                handleChange('isSimilar', false);
            }));
        }
    };
    
    return (<>
        <Dialog aria-labelledby="simple-dialog-title" open={true} className={'a-dialog-md'}>
            <DialogTitle id="simple-dialog-title" className="p-0">
                <Toolbar className="border-bottom bg-white pe-0">
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={props.onClose}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" className="flex-grow-1">Add Category</Typography>
                    <div className="p-2" align='right'>
                        <ButtonView className='text-primary' onClick={() => categoryUpload()}>Save</ButtonView>
                    </div>
                </Toolbar>
            </DialogTitle>
            <DialogContent>
                <div className="col-12 col-sm-12 mb-4">
                    <TextFieldView label="Category Type" type={'text'} field={'categoryTypeName'} className={'col-12 col-sm-12'}
                        value={state.categoryTypeName} onChange={handleChange} />
                </div>
                <div className="col-12 col-sm-12 mb-4">
                    <TextFieldView label="Description" className={'col-12 col-sm-12'} value={state.categoryDescription}
                        onChange={handleChange} id="filled-multiline-static" multiline rows={4} type={'text'}
                        field={'categoryDescription'} />
                </div>
            </DialogContent>
        </Dialog>
        <Dialog aria-labelledby="simple-dialog-title" open={state.isSimilar} className={'a-dialog-md'}>
            <DialogContent>
                This name contains already present category type, Do you want to create or close?
            </DialogContent>
            <DialogActions>
                <ButtonView onClick={categoryUpload}>Create</ButtonView>
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

export const CategoryTypeView = connect(mapStateToProps, mapDispatchToProps)(CategoryType);