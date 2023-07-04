import React, { useEffect } from "react";
import { AppBarView } from "src/component/appbar-view";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { MenuPageView } from "./menulists/menus-view";
import BarChartIcon from '@material-ui/icons/BarChart';
import { ReceiptChartView } from "./receiptupload/receiptchart";
import { Button, Dialog, DialogActions, DialogTitle, IconButton, MenuItem, Paper, Tab, Tabs, Toolbar, Typography } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { apiActions } from "src/action/action";
import { COMMONAPI } from "src/apiurl";
import { Aggregates } from "src/helper/Aggregates";
import { isNullOrUndefinedOrEmpty, number2FormatFn } from "src/common";
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { tabProps } from "src/component/tab-view";
import { loginAction } from "./login/login-reducer";
import { history } from "src/helper/history";

function HomePage(props: any) {
    
    const [state, setState] = React.useState({ isChart: false, allSource: [], monthSource: [],
        masterData: {}, statementStr: '', tabIndex: 0, sourceData: [], sourceList: [], chartData: [],
        totalAmt: 0, creditAmt: 0, debitAmt: 0
    });

    const handleChange = (field: any, value: any) => {
        if (field === 'tabIndex') {
            let sourceData: any = [];
            let sourceList: any = [];
            let totalAmt = 0;
            let creditAmt = 0;
            let debitAmt = 0;
            if (+value === 0) {
                sourceData = state.allSource.filter((line: any) => line.name === state.statementStr);
                sourceList = sourceData.length ? sourceData[0]['value'] : [];
                let creditArr = sourceList.filter((line: any) => +line.transferId === 1);
                let debitArr = sourceList.filter((line: any) => +line.transferId === 2);
                creditAmt = Aggregates.sum(creditArr, 'value');
                debitAmt = Aggregates.sum(debitArr, 'value');
                totalAmt =  creditAmt - debitAmt;
            } else {
                sourceData = state.allSource.filter((line: any) => line.name === state.statementStr && +line.transferId === +value);
                sourceList = sourceData.length ? sourceData[0]['value'] : [];
                totalAmt = Aggregates.sum(sourceList, 'value');
            }
            setState(prevState => ({
                ...prevState,
                [field]: value,
                sourceData: sourceData,
                sourceList: sourceList,
                chartData: state.allSource.filter((line: any) => line.name === state.statementStr),
                totalAmt: totalAmt,
                creditAmt: creditAmt,
                debitAmt: debitAmt
            }));
        } else if (typeof value === 'object') {
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
        refresh();
        return () => {
            if ((window.location.href).indexOf('login') !== -1) {
                history.push('/home');
                props.dispatch(loginAction.homeToLogin(true));
            } else {
                history.push('/login');
                props.dispatch(loginAction.homeToLogin(false));
            }
        }
    }, []);

    const refresh = () => {
        props.dispatch(apiActions.methodAction('get', COMMONAPI('home', null).RECEIPTRELATEDMASTER, {}, (res: any) => {
            let monthlyExpenseSpecificData = res.monthlyExpenseData.length ? res.monthlyExpenseData[0] : {};
            let source = [
                {name: 'Category Report', value: res.sumOfCategory, borderColor: 'rgb(255, 99, 132)', backgroundColor: ['peachpuff']},
                {name: 'Bank Report', value: res.sumOfBank, borderColor: 'rgb(255, 99, 132)', backgroundColor: ['peachpuff']},
                {name: 'Spent Report', value: res.sumOfSpent, borderColor: 'rgb(255, 99, 132)', backgroundColor: ['peachpuff']}
            ];
            let monthSource = [
                {name: 'Category Report', value: JSON.parse(monthlyExpenseSpecificData.categoryTypes || '[]') || [],
                    borderColor: 'rgb(255, 99, 132)', backgroundColor: ['pink']},
                {name: 'Bank Report', value: JSON.parse(monthlyExpenseSpecificData.bankNames || '[]') || [],
                    borderColor: 'rgb(255, 99, 132)', backgroundColor: ['pink']}
            ];
            handleChange('datasource', { masterData: res, allSource: source, monthSource: monthSource });
        }));
    }

    let creditList = (state.masterData['sumOfCategory'] || []).filter((line: any) => +line.transferId === 1);
    let debitList = (state.masterData['sumOfCategory'] || []).filter((line: any) => +line.transferId === 2);

    let template = <>
        <AppBarView></AppBarView>
        <div className="row m-3 border a-border-radius-10">
            <div className="fw-bold pt-2 row m-0">
                <div className="col p-0">Account Details</div>
                <div className='px-4' style={{width: '24px'}} onClick={() => handleChange('datasource', {...state, isChart: true})}>
                    <BarChartIcon></BarChartIcon>
                </div>
            </div>
            <div className="row m-0 py-3 border-bottom">
                <div className="text-center col-6">
                    <div>Credit Amount</div>
                    <div className="fw-bold">{number2FormatFn(Aggregates.sum(creditList, 'value'))}</div>
                </div>
                <div className="text-center col-6">
                    <div>Debit Amount</div>
                    <div className="fw-bold">{number2FormatFn(Aggregates.sum(debitList, 'value'))}</div>
                </div>
            </div>
            <div className="row m-0">
                <div className="col-4 col-sm-4 px-0 py-2 text-center border-end" onClick={() => handleChange('datasource', {...state, statementStr: 'Category Report'})}>Category</div>
                <div className="col-4 col-sm-4 px-0 py-2 text-center border-end"onClick={() => handleChange('datasource', {...state, statementStr: 'Bank Report'})}>Bank</div>
                <div className="col-4 col-sm-4 px-0 py-2 text-center" onClick={() => handleChange('datasource', {...state, statementStr: 'Spent Report'})}>Spend</div>
            </div>
        </div>
        <MenuPageView></MenuPageView>
    </>;
    if (state.isChart) {
        template = <>
            <div className="a-appbar">
                <Toolbar className="border-bottom bg-white">
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => handleChange('datasource', {...state, isChart: false})}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" className="flex-grow-1">Expense Report</Typography>
                </Toolbar>
            </div>
            <div className="m-2">
                <ReceiptChartView allSource={state.allSource} monthSource={state.monthSource}></ReceiptChartView>
            </div>
        </>;
    } else if (!isNullOrUndefinedOrEmpty(state.statementStr)) {
        template = <>
            <div className="a-appbar">
                <Toolbar className="border-bottom bg-white">
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => handleChange('datasource', {...state, statementStr: ''})}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" className="flex-grow-1">{state.statementStr}</Typography>
                </Toolbar>
            </div>
            <div className="m-2">
                <ReceiptChartView allSource={state.chartData} monthSource={state.monthSource} hideHeader={true}></ReceiptChartView>
                <div className="pt-2">
                    <Paper square elevation={0}>
                        <Tabs value={state.tabIndex} indicatorColor="primary" textColor="primary"
                            onChange={(event: any, value: number) => handleChange('tabIndex', value)}>
                            <Tab label="All" className="col-4" {...tabProps(0)} />
                            <Tab label="Credit" className="col-4" {...tabProps(1)} />
                            <Tab label="Debit" className="col-4" {...tabProps(2)} />
                        </Tabs>
                    </Paper>
                </div>
                <div className="col-12 col-sm-3 p-3">
                    {state.sourceList.map((line: any, lineInd: number) => {
                        return <MenuItem className={((lineInd === state.sourceList.length - 1) ? '' : 'border-bottom') + " col-12 row m-0 p-0"} key={lineInd}>
                            <div className="col-6 p-0">
                                <span className="text-secondary text-capitalize">{line.name}</span>
                                {+state.tabIndex === 0 ? <>
                                    {+line.transferId === 1 ? <ArrowRightAltIcon style={{transform: `rotate(270deg)`, color: 'green'}} /> :
                                        <ArrowRightAltIcon style={{transform: `rotate(90deg)`, color: 'red'}} />}
                                </> : <></>}
                            </div>
                            <div className="col-6 p-0 fw-bold" align="right">{number2FormatFn(line.value)}</div>
                        </MenuItem>;
                    })}
                    {state.sourceList.length ? <MenuItem className="col-12 row m-0 p-0" style={{borderTop: '1px solid black', borderBottom: '1px solid black'}}>
                        <div className="col-6 p-0 fw-bold text-capitalize">Total</div>
                        <div className="col-6 p-0 fw-bold" align="right">
                        {+state.tabIndex === 0 ? <>
                            <span>{state.creditAmt}</span>
                            <ArrowRightAltIcon style={{transform: `rotate(270deg)`, color: 'green'}} />
                            <span className="px-2">-</span>
                            <span>{state.debitAmt}</span>
                            <ArrowRightAltIcon style={{transform: `rotate(90deg)`, color: 'red'}} />
                            <span className="px-2">=</span>
                            <span>{state.totalAmt}</span>
                        </> : <span>{state.totalAmt}</span>}
                        </div>
                    </MenuItem> : <></>}
                </div>
            </div>
        </>;
    }
    return (<>
        {template}
        <Dialog open={props.isConfirm} onClose={() => props.dispatch(loginAction.homeToLogin(false))} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{"Do you want to Signout?"}</DialogTitle>
            <DialogActions>
                <Button onClick={() => {
                    sessionStorage.removeItem('accessToken');
                    sessionStorage.removeItem('userUuid');
                    props.dispatch(loginAction.logoutRequest());
                }} className="text-primary">Ok</Button>
                <Button onClick={() => props.dispatch(loginAction.homeToLogin(false))} autoFocus>Cancel</Button>
            </DialogActions>
        </Dialog>
    </>);
}

const mapStateToProps = function(state: IState) {
    return {
        isConfirm: state.loginUser.isHomeToLogin,
        loggingIn: state.loginUser.loggingIn
    };
};

const mapDispatchToProps = function(dispatch: Dispatch) {
    return {
        dispatch: dispatch
    };
};

export const HomePageView = connect(mapStateToProps, mapDispatchToProps)(HomePage);