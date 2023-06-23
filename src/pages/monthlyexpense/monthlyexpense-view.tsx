import React, { useEffect } from "react";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { IconButton, List, ListItem, ListItemText, MuiThemeProvider, Toolbar, Typography } from "@material-ui/core";
import { MonthlyExpenseEditView } from "./monthlyexpense-edit";
import { history } from "src/helper/history";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { menuListAction } from "../menulists/menulists-reducer";
import AddIcon from '@material-ui/icons/Add';
import { apiActions } from "src/action/action";
import { MONTHLYEXPENSE } from "src/apiurl";
import moment from "moment";
import { ButtonView } from "src/component/button-view";
import { buttonViewTheme } from "src/commontheme-css";
import EditIcon from '@material-ui/icons/Edit';

function MonthlyExpense(props: any) {
    const SPACED_DATE_FORMAT = "DD MMM YYYY";
    const [state, setState] = React.useState({getAllDatas: [], headerData: {}, isInitial: true, isEdit: false});

    const handleChange = (field: any, value: any) => {
        if (typeof value === 'object') {
            setState(prevState => ({
                ...prevState,
                ...value
            }));
        } else {
            setState(prevState => ({
                ...prevState,
                [field]: value
            }));
        }
    };

    useEffect(() => {
        if (state.isInitial) {
            refresh();
        }
    });

    const refresh = () => {
        props.dispatch(apiActions.methodAction('get', MONTHLYEXPENSE().GET, {}, (result: any) => {
            handleChange('getAllDatas', {'getAllDatas': result.data, isInitial: false});
        }));
    };
    
    return (<>
        {state.isEdit ? <MonthlyExpenseEditView headerData={state.headerData} getAllDatas={state.getAllDatas}
                onClose={(expense: any) => {
                    if (expense) {
                        state.getAllDatas.push(expense);
                    }
                    handleChange('headerData', {headerData: {}, isEdit: false, getAllDatas: state.getAllDatas});
                }}>
            </MonthlyExpenseEditView> :
            <div className="col-12 col-sm-12 bg-light">
                <div className="a-appbar">
                    <Toolbar className="border-bottom bg-white a-sticky-t0-z101">
                        <IconButton edge="start" color="inherit" aria-label="menu"
                            onClick={() => {
                                props.dispatch(menuListAction.menuSelection(false));
                                history.push('/\menu');
                            }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6" className="flex-grow-1">Monthly Expense</Typography>
                        <MuiThemeProvider theme={buttonViewTheme}>
                            <ButtonView color="inherit" onClick={() => handleChange('headerData', {headerData: {}, isEdit: true})}
                                startIcon={<AddIcon></AddIcon>}>
                                    <span className="pt-1 d-none d-sm-block">Add New</span>
                            </ButtonView>
                        </MuiThemeProvider>
                    </Toolbar>
                </div>
                <div className="col-12 col-sm-4 a-appbar-minus">
                    <List className={state.getAllDatas.length ? "border-bottom bg-white" : "bg-white"}>
                        {state.getAllDatas.map((header: any, index: number) => {
                            let monthlyDayText = `${moment(new Date(header.fromDate)).format(SPACED_DATE_FORMAT)} - ${moment(new Date(header.toDate)).format(SPACED_DATE_FORMAT)}`;
                            return <ListItem button onClick={() => handleChange('headerData', {headerData: header, isEdit: true})}
                                className={state.getAllDatas.length === (index + 1) ? '' : 'border-bottom'}>
                                <ListItemText primary={header.templateName} secondary={monthlyDayText}></ListItemText>
                                <div style={{width: '40px'}} className={'px-2'}>
                                    <EditIcon fontSize={'medium'} className="text-secondary"></EditIcon>
                                </div>
                            </ListItem>;
                        })}
                    </List>
                </div>
            </div>}
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

export const MonthlyExpenseView = connect(mapStateToProps, mapDispatchToProps)(MonthlyExpense);