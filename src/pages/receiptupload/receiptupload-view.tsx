import React, { useEffect } from "react";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { Avatar, Dialog, DialogContent, DialogTitle, IconButton, ImageList,
    ImageListItem, List, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, MuiThemeProvider, Paper, Tab, Tabs, Toolbar, Tooltip, Typography } from "@material-ui/core";
import { menuListAction } from "../menulists/menulists-reducer";
import MUIDataTable from "mui-datatables";
import { history } from "src/helper/history";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from '@material-ui/icons/Add';
import { TextFieldView } from "src/component/textfield-view";
import { DropDownView } from "src/component/dropdown-view";
import { DatePickerView } from "src/component/datepicker-view";
import { apiActions } from "src/action/action";
import { ImageView } from "src/component/image-view";
import moment from "moment";
import { createMuiTheme } from "@material-ui/core/styles";
import { Browser } from "src/helper/browser";
import { CategoryTypeView } from "../mastercomponent/categorytype-view";
import { BankDetailsView } from "../mastercomponent/bank-view";
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { Aggregates } from "src/helper/Aggregates";
import { isNullOrUndefinedOrEmpty, number2FormatFn } from "src/common";
import { alertAction } from "../alert/alert-reducer";
import { COMMONAPI, RECEIPTUPLOADAPI } from "src/apiurl";
import { ButtonView } from "src/component/button-view";
import { TabPanel, tabProps } from "src/component/tab-view";
import { listStyles } from "src/commontheme-css";
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

function Receiptupload(props: any) {
    const SPACED_DATE_FORMAT = "DD MMM YYYY";
    let gridObj = {billDate: new Date(), categoryUuid: '', categoryTypeName: '', bankUuid: '', bankName: '',
        spentTypeUuid: '', spentType: '', amount: 0, image: '', description: '', transferType: '', transferTypeUuid: '',
        transferId: '' };
    const [state, setState] = React.useState({
        gridData: [], isNewReceipt: false, isImageView: false, imageData: '',
        isInitial: true, isCategoryType: false, monthlyExpenseTemplateSource: [], dropDownSource: [],
        isBankName: false, bankDropDownSource: [], isSummary: null, monthlyExpenseTemplate: '', monthlyExpenseTemplateUuid: '',
        monthExpenseObj: {}, ...gridObj, totalAmount: 0, creditAmt: 0, monthlyTotalAmount: 0, remainingAmount: 0,
        debitAmt: 0, tabIndex: 0, summaryTabIndex: 0
    });

    const handleChange = (field: any, value: any) => {
        if (typeof value === 'object' && field !== 'billDate' && field !== 'isSummary') {
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

    const options: any = {
        filter: true,
        selectableRows: false,
        filterType: 'dropdown',
        responsive: 'stacked',
        rowsPerPage: 10,
        tableBodyHeight: window.innerHeight - 262,
        customToolbar: () => {
            return (<>
                <Tooltip title={"Add New"}>
                    <IconButton onClick={() => {
                        if (isNullOrUndefinedOrEmpty(state.monthlyExpenseTemplateUuid)) {
                            props.dispatch(alertAction.error('Please Create Monthly Expense For This Month'));
                        } else {
                            handleChange('isNewReceipt', {...gridObj, isNewReceipt: true})
                        }
                    }}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </>);
        }
    };

    const columns: any = [
        { label: 'Bill Date', name: 'billDate', options: { sortDirection: 'desc',
            customBodyRender: (value: any) => moment(new Date(value)).format(SPACED_DATE_FORMAT) } },
        { label: 'Category Type', name: 'categoryTypeName' },
        { label: 'Bank Name', name: 'bankName' },
        { label: 'Amount', name: 'amount', options: {
            customBodyRender: function (value: number) {
                return number2FormatFn(value);
            }
        }},
        { label: 'Image', name: 'image', options: { customBodyRender: (image: any) => {
            return (
                <Avatar variant="rounded" src={image} onClick={() => {
                    if (image) {
                        handleChange('isImageView', {isImageView: true, imageData: image});
                    } else {
                        props.dispatch(alertAction.error('There is No Image'));
                    }
                }}></Avatar>
            ); } },
        },
        { label: 'Description', name: 'description' }
    ];

    useEffect(() => {
        if (state.isInitial) {
            props.dispatch(apiActions.methodAction('get', COMMONAPI('receiptUpload', null).RECEIPTRELATEDMASTER, {}, (res: any) => {
                // let validMonthExpense = res.monthlyExpenseData.filter((line: any) => {
                //     let currentDate = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
                //     if (new Date(new Date(line.fromDate).setHours(0, 0, 0, 0)).getTime() <= currentDate &&
                //         currentDate <= new Date(new Date(line.toDate).setHours(0, 0, 0, 0)).getTime()) {
                //         return line;
                //     }
                // });

                let filterCredit = res.receiptData.filter((line: any) => +line.transferId === 1);
                let creditAmt = Aggregates.sum(filterCredit, 'amount');

                let filterDebit = res.receiptData.filter((line: any) => +line.transferId !== 1);
                let debitAmt = Aggregates.sum(filterDebit, 'amount');

                let currentMonthData = res.monthlyExpenseData.filter((line: any) => +line.expenseMonth + 1 === new Date().getMonth());
                let currentMonthDataObj = currentMonthData[0] || {};
                let totalAmount = (currentMonthDataObj['totalAmount'] || 0) + (creditAmt || 0);
                let expenseAmount = (+state.monthExpenseObj['expenseAmount'] || 0) + (debitAmt || 0);
                handleChange('gridData', { dropDownSource: res.categoryData, bankDropDownSource: res.bankData, gridData: res.receiptData,
                    monthlyExpenseTemplateUuid: currentMonthDataObj.uuid, monthlyExpenseTemplate: currentMonthDataObj.templateName,
                    monthlyExpenseTemplateSource: res.monthlyExpenseData, isInitial: false, monthExpenseObj: currentMonthDataObj,
                    monthlyTotalAmount: (currentMonthDataObj['totalAmount'] || 0), totalAmount: totalAmount,
                    creditAmt: (creditAmt || 0), debitAmt: (debitAmt || 0),
                    remainingAmount: ((+totalAmount || 0) - (+expenseAmount || 0)) });
            }));
        }
        let descriptionText = state.categoryTypeName + ' - ' + state.bankName + ' - ' + state.spentType + ' - ' + state.transferType + ' - ' + state.amount;
        handleChange('description', descriptionText);
    }, [state.categoryTypeName, state.bankName, state.spentType, state.amount]);

    const receiptupload = () => {
        let getCategoryList = state.gridData.filter((line: any) => line.categoryUuid === state.categoryUuid);
        let categoryAmt = Aggregates.sum(getCategoryList, 'amount') + (+state.amount || 0);
        let monthCategoryTypes = JSON.parse(state.monthExpenseObj['categoryTypes'] || `[]`).filter((category: any) => category.uuid === state.categoryUuid);
        let monthCategoryAmt = Aggregates.sum(monthCategoryTypes, 'amount');
        let calcCategoryAmt = monthCategoryAmt - categoryAmt;

        let postData = {
            billDate: moment(new Date(state.billDate)).format("YYYY-MM-DD h:mm:ss"),
            monthlyExpenseTemplate: state.monthlyExpenseTemplate,
            monthlyExpenseTemplateUuid: state.monthlyExpenseTemplateUuid,
            categoryUuid: state.categoryUuid,
            categoryTypeName: state.categoryTypeName,
            bankUuid: state.bankUuid,
            bankName: state.bankName,
            spentTypeUuid: state.spentTypeUuid,
            spentType: state.spentType,
            transferTypeUuid: state.transferTypeUuid,
            transferType: state.transferType,
            transferId: state.transferId,
            amount: +state.amount || 0,
            image: state.image,
            description: state.description
        };
        if (isNullOrUndefinedOrEmpty(postData.categoryUuid)) {
            props.dispatch(alertAction.error('Please Choose Category Type'));
        } else if (isNullOrUndefinedOrEmpty(postData.bankUuid)) {
            props.dispatch(alertAction.error('Please Choose Bank Type'));
        } else if (isNullOrUndefinedOrEmpty(postData.amount) || postData.amount === 0) {
            props.dispatch(alertAction.error('Please Enter Amount'));
        } else if (isNullOrUndefinedOrEmpty(postData.spentTypeUuid)) {
            props.dispatch(alertAction.error('Please Choose Spent Type'));
        } else if (isNullOrUndefinedOrEmpty(postData.transferTypeUuid)) {
            props.dispatch(alertAction.error('Please Choose Transfer Type'));
        } else {
            if (+calcCategoryAmt < 0) {
                props.dispatch(alertAction.error('Amount Greater than the Allocated Amount'));
            }
            props.dispatch(apiActions.methodAction('post', RECEIPTUPLOADAPI().POST, postData, (res: any) => {
                let gridData = state.gridData.concat([res.data]);

                let filterCredit = gridData.filter((line: any) => +line.transferId === 1);
                let creditAmt = Aggregates.sum(filterCredit, 'amount');

                let filterDebit = gridData.filter((line: any) => +line.transferId !== 1);
                let debitAmt = Aggregates.sum(filterDebit, 'amount');

                let totalAmount = (state.monthlyTotalAmount || 0) + (creditAmt || 0);
                let expenseAmount = (+state.monthExpenseObj['expenseAmount'] || 0) + (debitAmt || 0);
                handleChange('isNewReceipt', { isNewReceipt: false, gridData: gridData,
                    totalAmount: totalAmount, creditAmt: (creditAmt || 0), debitAmt: (debitAmt || 0),
                    remainingAmount: ((+totalAmount || 0) - (+expenseAmount || 0)) });
            }));
        }
    };

    const allocatedTemplate = () => {
        return <div className="bg-white col-sm-12 p-0 pt-2">
            <div className="row m-0">
                <div className="col-6 col-sm-6 pb-2">Total Amount</div>
                <div className="col-6 col-sm-6 pb-2" align="right">{state.monthlyTotalAmount || 0}</div>
            </div>
            <div className="row m-0">
                <div className="col-6 col-sm-6 pb-2">Credited Amount</div>
                <div className="col-6 col-sm-6 pb-2" align="right">{state.creditAmt || 0}</div>
            </div>
            <div className="row m-0">
                <div className="col-6 col-sm-6 pb-2">Debited Amount</div>
                <div className="col-6 col-sm-6 pb-2" align="right">{state.debitAmt || 0}</div>
            </div>
            <div className="row m-0 pb-2 fw-bold text-secondary">
                <div className="col-6 col-sm-6">Expense Amount</div>
                <div className="col-6 col-sm-6" align="right">{state.monthExpenseObj['expenseAmount'] || 0}</div>
            </div>
            <div className="row m-0 py-2 border-top border-bottom">
                <div className="col-6 col-sm-6">Saving Amount</div>
                <div className="col-6 col-sm-6" align="right">{state.remainingAmount || 0}</div>
            </div>
        </div>;
    }

    const categorySummaryTemplate = () => {
        return <div className="bg-white col-sm-12 p-0">
            <List className={listClasses.root}>
                {state.dropDownSource.map((types: any, ind: number) => {
                    let monthCategoryTypes = JSON.parse(state.monthExpenseObj['categoryTypes'] || `[]`).filter((category: any) => category.uuid === types.uuid);
                    let monthCategoryTypesObj = monthCategoryTypes[0] || {};
                    let geFilterData = state.gridData.filter((type: any) => type.categoryUuid === types.uuid);

                    let sumCreditAmt = geFilterData.filter((type: any) => +type.transferId === 1);
                    let sumDebitAmt = geFilterData.filter((type: any) => +type.transferId !== 1);
                    let sumCreditVal = Aggregates.sum(sumCreditAmt, 'amount');
                    let sumDebitVal = Aggregates.sum(sumDebitAmt, 'amount');
                    let sumVal = ((+sumCreditVal || 0) - (+sumDebitVal || 0));

                    let remainAmt = (+monthCategoryTypesObj.amount || 0) + (sumVal || 0);
                    overallCategoryRemainAmt += +remainAmt || 0;
                    overallCategorySpentAmt += +sumDebitVal || 0;
                    // let diffAmt = ((monthCategoryTypesObj.amount || 0) + (sumVal || 0)) < 0 ? true : false;
                    return <ListItem className="border-bottom">
                        <div className={'col-12 col-sm-12'}>
                            <div className="col-sm-12">{types.categoryTypeName}</div>
                            <div className="row m-0">
                                <div className="col-6 col-sm-6 p-0">
                                    <span className="text-secondary">Alloc: </span>
                                    <span>{number2FormatFn(monthCategoryTypesObj.amount || 0)}</span>
                                </div>
                                <div className="col-6 col-sm-6 p-0" align="right">
                                    <span className="text-secondary">Remain: </span>
                                    <span>{remainAmt || 0}</span>
                                </div>
                            </div>
                            <div className="row m-0">    
                                {+sumCreditVal > 0 ? <div className="col-6 col-sm-6 p-0" style={{color: 'green'}}>
                                    <span>Ct: {number2FormatFn(sumCreditVal || 0)}</span>
                                    <ArrowRightAltIcon style={{transform: `rotate(270deg)`}} />
                                </div> :
                                <div className="col-6 col-sm-6 p-0" style={{color: 'red'}}>
                                    <span>Dt: {number2FormatFn(sumDebitVal || 0)}</span>
                                    <ArrowRightAltIcon style={{transform: `rotate(90deg)`}} />
                                </div>}
                            </div>
                        </div>
                    </ListItem>
                })}
            </List>
            {/* <div className="row m-0 pb-2 a-fw-md">
                <div className="col-sm-4">Category Type</div>
                <div className="col-sm-2">Allocated</div>
                <div className="col-sm-2">Credit</div>
                <div className="col-sm-2">Spend</div>
                <div className="col-sm-2 text-end">Remaining</div>
            </div>
            <div className="col-sm-12 pb-2">
                {state.dropDownSource.map((types: any) => {
                    let monthCategoryTypes = JSON.parse(state.monthExpenseObj['categoryTypes'] || `[]`).filter((category: any) => category.uuid === types.uuid);
                    let monthCategoryTypesObj = monthCategoryTypes[0] || {};
                    let geFilterData = state.gridData.filter((type: any) => type.categoryUuid === types.uuid);

                    let sumCreditAmt = geFilterData.filter((type: any) => +type.transferId === 1);
                    let sumDebitAmt = geFilterData.filter((type: any) => +type.transferId !== 1);
                    let sumCreditVal = Aggregates.sum(sumCreditAmt, 'amount');
                    let sumDebitVal = Aggregates.sum(sumDebitAmt, 'amount');
                    let sumVal = ((+sumCreditVal || 0) - (+sumDebitVal || 0));

                    let remainAmt = (+monthCategoryTypesObj.amount || 0) + (sumVal || 0);
                    overallCategoryRemainAmt += +remainAmt || 0;
                    overallCategorySpentAmt += +sumDebitVal || 0;
                    let diffAmt = ((monthCategoryTypesObj.amount || 0) + (sumVal || 0)) < 0 ? true : false;
                    return <div className={"row m-0 py-2 " + (diffAmt ? 'text-danger' : '')}>
                        <div className="col-sm-4">{types.categoryTypeName}</div>
                        <div className="col-sm-2">{monthCategoryTypesObj.amount || 0}</div>
                        <div className="col-sm-2">
                            <span>{sumCreditVal || 0}</span>
                            <ArrowRightAltIcon style={{color: 'green', transform: `rotate(270deg)`}} />
                        </div>
                        <div className="col-sm-2">
                            <span>{sumDebitVal || 0}</span>
                            <ArrowRightAltIcon style={{color: 'red', transform: `rotate(90deg)`}} />
                        </div>
                        <div className="col-sm-2 fw-bold text-end">{remainAmt || 0}</div>
                    </div>
                })}
            </div> */}
            <div className={"row m-0 py-2 " + (overallCategoryRemainAmt < 0 ? 'text-danger' : '')}>
                <div className="col-6 col-sm-6">Categorywise Remaining Amount</div>
                <div className="col-6 col-sm-6 fw-bold" align="right">{overallCategoryRemainAmt}</div>
            </div>
            <div className={"row m-0 py-2 border-top border-bottom " + (((+state.remainingAmount) > (+state.totalAmount - (+overallCategorySpentAmt || 0))) ? 'text-danger' : '')}>
                <div className="col-6 col-sm-6">Overall Saving Amount</div>
                <div className={"col-6 col-sm-6 fw-bold"} align="right">
                    {(+state.totalAmount || 0) - (+overallCategorySpentAmt || 0)}
                </div>
            </div>
        </div>;
    }

    const bankSummaryTemplate = () => {
        return <div className="bg-white col-sm-12 p-0">
            <List className={listClasses.root}>
                {state.bankDropDownSource.map((types: any, ind: number) => {
                    let monthBankTypes = JSON.parse(state.monthExpenseObj['bankNames'] || `[]`).filter((bank: any) => bank.uuid === types.uuid);
                    let monthBankTypesObj = monthBankTypes[0] || {};
                    let geFilterData = state.gridData.filter((type: any) => type.bankUuid === types.uuid);

                    let sumCreditAmt = geFilterData.filter((type: any) => +type.transferId === 1);
                    let sumDebitAmt = geFilterData.filter((type: any) => +type.transferId !== 1);
                    let sumCreditVal = Aggregates.sum(sumCreditAmt, 'amount');
                    let sumDebitVal = Aggregates.sum(sumDebitAmt, 'amount');
                    let sumVal = ((+sumCreditVal || 0) - (+sumDebitVal || 0));


                    let remainAmt = (+monthBankTypesObj.amount || 0) + (sumVal || 0);
                    overallBankRemainAmt += +remainAmt || 0;
                    overallBankSpentAmt += +sumDebitVal || 0;
                    // let diffAmt = ((monthBankTypesObj.amount || 0) + (sumVal || 0)) < 0 ? true : false;
                    return <ListItem className="border-bottom">
                        <div className={'col-12 col-sm-12'}>
                            <div className="col-sm-12">{types.bankName}</div>
                            <div className="row m-0">
                                <div className="col-6 col-sm-6 p-0">
                                    <span className="text-secondary">Alloc: </span>
                                    <span>{number2FormatFn(monthBankTypesObj.amount || 0)}</span>
                                </div>
                                <div className="col-6 col-sm-6 p-0" align="right">
                                    <span className="text-secondary">Remain: </span>
                                    <span>{remainAmt || 0}</span>
                                </div>
                            </div>
                            <div className="row m-0">    
                                <div className="col-6 col-sm-6 p-0" style={{color: 'green'}}>
                                    <span>Ct: {number2FormatFn(sumCreditVal || 0)}</span>
                                    <ArrowRightAltIcon style={{transform: `rotate(270deg)`}} />
                                </div>
                                <div className="col-6 col-sm-6 p-0" align="right" style={{color: 'red'}}>
                                    <span>Dt: {number2FormatFn(sumDebitVal || 0)}</span>
                                    <ArrowRightAltIcon style={{transform: `rotate(90deg)`}} />
                                </div>
                            </div>
                        </div>
                    </ListItem>
                })}
            </List>
            {/* <div className="row m-0 pb-2 a-fw-md">
                <div className="col-sm-4">Bank Name</div>
                <div className="col-sm-2">Allocated</div>
                <div className="col-sm-2">Credit</div>
                <div className="col-sm-2">Spend</div>
                <div className="col-sm-2 text-end">Remaining</div>
            </div>
            <div className="col-sm-12 pb-2">
                {state.bankDropDownSource.map((types: any) => {
                    let monthBankTypes = JSON.parse(state.monthExpenseObj['bankNames'] || `[]`).filter((bank: any) => bank.uuid === types.uuid);
                    let monthBankTypesObj = monthBankTypes[0] || {};
                    let geFilterData = state.gridData.filter((type: any) => type.bankUuid === types.uuid);

                    let sumCreditAmt = geFilterData.filter((type: any) => +type.transferId === 1);
                    let sumDebitAmt = geFilterData.filter((type: any) => +type.transferId !== 1);
                    let sumCreditVal = Aggregates.sum(sumCreditAmt, 'amount');
                    let sumDebitVal = Aggregates.sum(sumDebitAmt, 'amount');
                    let sumVal = ((+sumCreditVal || 0) - (+sumDebitVal || 0));


                    let remainAmt = (+monthBankTypesObj.amount || 0) + (sumVal || 0);
                    overallBankRemainAmt += +remainAmt || 0;
                    overallBankSpentAmt += +sumDebitVal || 0;
                    let diffAmt = ((monthBankTypesObj.amount || 0) + (sumVal || 0)) < 0 ? true : false;
                    return <div className={"row m-0 " + (diffAmt ? 'text-danger' : '')}>
                        <div className="col-sm-4">{types.bankName}</div>
                        <div className="col-sm-2">{monthBankTypesObj.amount || 0}</div>
                        <div className="col-sm-2">{sumCreditVal || 0}</div>
                        <div className="col-sm-2">{sumDebitVal || 0}</div>
                        <div className="col-sm-2 fw-bold text-end">{remainAmt || 0}</div>
                    </div>
                })}
            </div> */}
            <div className={"row m-0 py-2 " + (overallBankRemainAmt < 0 ? 'text-danger' : '')}>
                <div className="col-6 col-sm-6">Bankwise Remaining Amount</div>
                <div className="col-6 col-sm-6 fw-bold" align="right">{overallBankRemainAmt}</div>
            </div>
            <div className={"row m-0 py-2 border-top border-bottom " + (((+state.remainingAmount) > (+state.totalAmount - (+overallBankSpentAmt || 0))) ? 'text-danger' : '')}>
                <div className="col-6 col-sm-6">Overall Saving Amount</div>
                <div className={"col-6 col-sm-6 fw-bold"} align="right">
                    {(+state.totalAmount || 0) - (+overallBankSpentAmt || 0)}
                </div>
            </div>
        </div>;
    }

    const getMuiTheme = createMuiTheme({
        overrides: {
            MUIDataTableBodyCell: {
                cellStackedSmall: {
                    display: 'none'
                }
            },
            MUIDataTableHeadCell: {
                toolButton: {
                    color: 'black',
                    fontWeight: 700
                }
            },
            MUIDataTableToolbar: {
                root: {
                    borderBottom: '1px solid rgba(224, 224, 224, 1)',
                    position: 'sticky',
                    // top: '64px',
                    zIndex: 101,
                    background: 'white'
                }
            },
            MuiTableCell: {
                root: {
                    borderBottom: Browser.isDeviceScreen ? 'unset' : '1px solid rgba(224, 224, 224, 1)'
                }
            },
            MuiList: {
                root: {
                    width: '300px'
                }
            },
            MuiListItem: {
                root: {
                    "&:not(:last-child)": {
                        borderBottom: '2px solid whitesmoke'
                    }
                }
            },
            MuiTableHead: {
                root: {
                    zIndex: 0
                }
            }
        }
    });
    let compareHistoryMoveDate = new Date(new Date(props.loginCurrentUser.historyMovedDate).setHours(0, 0, 0, 0)).getTime() ===
        new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    let overallCategoryRemainAmt = 0;
    let overallBankRemainAmt = 0;
    let overallCategorySpentAmt = 0;
    let overallBankSpentAmt = 0;
    const listClasses = listStyles();
    return (<>
        <div className="col-sm-12 bg-light h-100">
            <div className="a-appbar">
                <Toolbar className="border-bottom bg-white a-sticky-t0-z101">
                    <IconButton edge="start" color="inherit" aria-label="menu"
                        onClick={() => {
                            props.dispatch(menuListAction.menuSelection(false));
                            history.push('/\menu');
                        }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" className="flex-grow-1">Receipt Upload</Typography>
                    {compareHistoryMoveDate && <div className="text-danger fw-bold">Last Month Record Moved to Receipt History</div>}
                </Toolbar>
            </div>
            <div className="position-relative" style={{zIndex: 1}}>
                <Paper square elevation={0} className="border-bottom">
                    <Tabs value={state.tabIndex} indicatorColor="primary" textColor="primary"
                        onChange={(event: any, value: number) => handleChange('tabIndex', value)}>
                        <Tab label="Summary" className="w-50" {...tabProps(0)} />
                        <Tab label="Receipt List" className="w-50" {...tabProps(1)} />
                    </Tabs>
                </Paper>
            </div>
            <div className="col-12 col-sm-12 row m-0 p-0 overflow-auto" style={{height: 'calc(100% - 113px)'}}>
                <TabPanel value={state.tabIndex} index={0} className='p-0'>
                    {Browser.isDeviceScreen ? <>
                        <div className="position-sticky" style={{zIndex: 1, top: '1px'}}>
                            <Paper square elevation={0} className="border-bottom">
                                <Tabs value={state.summaryTabIndex} indicatorColor="primary" textColor="primary"
                                    onChange={(event: any, value: number) => handleChange('summaryTabIndex', value)}>
                                    <Tab label="Allocated Amount" {...tabProps(0)} />
                                    <Tab label="Category Wise List" {...tabProps(1)} />
                                    <Tab label="Bank Wise List" {...tabProps(2)} />
                                </Tabs>
                            </Paper>
                        </div>
                        <TabPanel value={state.summaryTabIndex} index={0} className='p-0'>
                            {allocatedTemplate()}
                        </TabPanel>
                        <TabPanel value={state.summaryTabIndex} index={1} className='p-0'>
                            {categorySummaryTemplate()}
                        </TabPanel>
                        <TabPanel value={state.summaryTabIndex} index={2} className='p-0'>
                            {bankSummaryTemplate()}
                        </TabPanel>
                    </> :
                    <div className="p-2">
                        <div className="col-sm-12 row m-0">
                            <div className="col-12 col-sm-4 p-0 h-100">
                                <div className="bg-white col-sm-12 p-0 pt-2">
                                    <div className="row m-0">
                                        <div className="a-fw-md col-sm-12 pb-3 fw-bold">Allocated Amount</div>
                                    </div>
                                    {allocatedTemplate()}
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 row m-0 h-100">
                                <div className="bg-white col-sm-12 p-0 pt-2">
                                    <div className="a-fw-md col-sm-12 px-3 fw-bold">Category Wise List</div>
                                    {categorySummaryTemplate()}
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 p-0 row m-0 h-100">
                                <div className="bg-white col-sm-12 p-0 pt-2">
                                    <div className="a-fw-md col-sm-12 px-3 fw-bold">Bank Wise List</div>
                                    {bankSummaryTemplate()}
                                </div>
                            </div>
                        </div>
                    </div>}
                </TabPanel>
                <TabPanel value={state.tabIndex} index={1} className='p-0'>
                    {Browser.isDeviceScreen ? <List className={listClasses.root}>
                        {state.gridData.map((line: any, ind: number) => {
                            return <ListItem className="border-bottom">
                                <ListItemAvatar>
                                    <Avatar variant="rounded" src={line.image} onClick={() => {
                                        if (line.image) {
                                            handleChange('isImageView', {isImageView: true, imageData: line.image});
                                        } else {
                                            props.dispatch(alertAction.error('There is No Image'));
                                        }
                                    }}></Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={line.categoryTypeName} secondary={moment(new Date(line.billDate)).format(SPACED_DATE_FORMAT)} />
                                <div>{number2FormatFn(line.amount)}</div>
                            </ListItem>
                        })}
                    </List> :
                    <div className="p-2">
                        <MuiThemeProvider theme={getMuiTheme}>
                            <MUIDataTable columns={columns} data={state.gridData} title={
                                <Tooltip title={"Summary Details"}>
                                    <IconButton onClick={(event: any) => {
                                        if (state.gridData.length === 0) {
                                            props.dispatch(alertAction.error('There is No Receipt Records'));
                                        } else {
                                            handleChange('isSummary', event.currentTarget);
                                        }
                                    }}>
                                        <EqualizerIcon></EqualizerIcon>
                                    </IconButton>
                                </Tooltip>
                            } options={options} />
                        </MuiThemeProvider>
                    </div>}
                </TabPanel>
            </div>
        </div>
        <Dialog aria-labelledby="simple-dialog-title" open={state.isNewReceipt} className={'a-dialog-md'}>
            <DialogTitle id="simple-dialog-title" className="p-0">
                <Toolbar className="border-bottom bg-white">
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => handleChange('isNewReceipt', false)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" className="flex-grow-1">New Receipt Upload</Typography>
                    <div className="p-2">
                        <ButtonView variant="contained" color="primary" onClick={() => receiptupload()}>Save</ButtonView>
                    </div>
                </Toolbar>
            </DialogTitle>
            <DialogContent>
                <div className="col-sm-12">
                    <DatePickerView format={"dd/MM/yyyy"} label="From Date" className="col-sm-12"
                        value={state.billDate} onChange={handleChange} field={'billDate'}></DatePickerView>
                </div>
                <div className="col-sm-12 mb-4">
                    <DropDownView field={'categoryUuid'} label={'Category Type'} value={state.categoryUuid} required
                        onChange={(field: string, value: any, obj: any) =>
                            handleChange(field, {categoryUuid: obj.uuid, categoryTypeName: obj.categoryTypeName})}
                        dataSource={state.dropDownSource} fields={{ text: 'categoryTypeName', value: 'uuid' }} footerTemlate={() => {
                            return <div className="text-primary" onClick={() => handleChange('isCategoryType',
                                {isCategoryType: true, categoryUuid: '', categoryTypeName: ''})}>
                                <MenuItem value={'addNew'}>
                                    <AddIcon></AddIcon>
                                    <span className="px-1">{'Add New'}</span>
                                </MenuItem>
                            </div>;
                        }}></DropDownView>
                </div>
                <div className="col-sm-12 mb-4">
                    <DropDownView field={'bankName'} label={'Bank Type'} value={state.bankName}
                        onChange={(field: string, value: any, obj: any) =>
                            handleChange(field, {bankUuid: obj.uuid, bankName: obj.bankName})}
                        dataSource={state.bankDropDownSource} fields={{ text: 'bankName', value: 'bankName' }} footerTemlate={() => {
                            return <div className="text-primary" onClick={() => handleChange('isBankName', {isBankName: true, bankUuid: '', bankName: ''})}>
                                <MenuItem value={'addNew'}>
                                    <AddIcon></AddIcon>
                                    <span className="px-1">{'Add New'}</span>
                                </MenuItem>
                            </div>;
                        }}></DropDownView>
                </div>
                <div className="col-sm-12 mb-4">
                    <DropDownView field={'spentType'} label={'Spent Type'} value={state.spentType} required
                        onChange={(field: string, value: any, obj: any) =>
                            handleChange(field, {spentTypeUuid: obj.uuid, spentType: obj.spentType})}
                        dataSource={props.spentType} fields={{ text: 'spentType', value: 'spentType' }}>
                    </DropDownView>
                </div>
                <div className="col-sm-12 mb-4">
                    <DropDownView field={'transferType'} label={'Transfer Type'} value={state.transferType} required
                        onChange={(field: string, value: any, obj: any) =>
                            handleChange(field, {transferTypeUuid: obj.uuid, transferType: obj.transferType, transferId: obj.transferId})}
                        dataSource={props.transferType} fields={{ text: 'transferType', value: 'transferType' }}>
                    </DropDownView>
                </div>
                <div className="col-sm-12 mb-4">
                    <TextFieldView label="Amount" type={'number'} field={'amount'} className={'col-sm-12'} required
                        value={state.amount} onChange={handleChange} />
                </div>
                <div className="col-sm-12 mb-4">
                    <ImageView value={state.image} field={'image'} onChange={handleChange}></ImageView>
                </div>
                <div className="col-sm-12 mb-4">
                    <TextFieldView label="Description" className={'col-sm-12'} value={state.description}
                        onChange={handleChange} id="filled-multiline-static" multiline rows={4} type={'text'}
                        field={'description'} />
                </div>
            </DialogContent>
        </Dialog>
        <Dialog aria-labelledby="simple-dialog-title" open={state.isImageView} className={'a-dialog-md'}>
            <DialogTitle id="simple-dialog-title" className="p-0">
                <Toolbar className="border-bottom bg-white">
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => handleChange('isImageView', false)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6">Image View</Typography>
                </Toolbar>
            </DialogTitle>
            <DialogContent>
                <ImageList rowHeight={160} cols={3} className={'a-center-align pb-2'}>
                    <ImageListItem key={state.imageData} cols={1}>
                        <img src={state.imageData} />
                    </ImageListItem>
                </ImageList>
            </DialogContent>
        </Dialog>
        {state.isCategoryType && <CategoryTypeView dropDownSource={state.dropDownSource} refresh={(res: any) => {
            let dropDownSource = state.dropDownSource.concat([res.data]);
            handleChange('isCategoryType', {isCategoryType: false, dropDownSource: dropDownSource,
                categoryUuid: res.data.uuid, categoryTypeName: res.data.categoryTypeName});
        }} onClose={() => handleChange('isCategoryType', false)}></CategoryTypeView>}
        {state.isBankName && <BankDetailsView dropDownSource={state.bankDropDownSource} refresh={(res: any) => {
            let bankDropDownSource = state.bankDropDownSource.concat([res.data]);
            handleChange('isBankName', {isBankName: false, bankDropDownSource: bankDropDownSource,
                bankUuid: res.data.uuid, bankName: res.data.bankName});
        }} onClose={() => handleChange('isBankName', false)}></BankDetailsView>}
        <MuiThemeProvider theme={getMuiTheme}>
            <Menu anchorEl={state.isSummary} keepMounted open={Boolean(state.isSummary)} onClose={() => handleChange('isSummary', null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} getContentAnchorEl={null}>
                {state.dropDownSource.map((categoryList: any, index: number) => {
                    let filterData = state.gridData.filter((line: any) => line.categoryUuid === categoryList.uuid);
                    let sumVal = Aggregates.sum(filterData, 'amount');
                    return <MenuItem className="col-12 row m-0" key={index}>
                        <div className="col-6 p-0 text-secondary">{categoryList.categoryTypeName}</div>
                        <div className="col-6 p-0 fw-bold" align="right">{number2FormatFn(sumVal)}</div>
                    </MenuItem>;
                })}
            </Menu>
        </MuiThemeProvider>
    </>);
}

const mapStateToProps = function(state: IState) {
    return {
        spentType: state.commonReducer.spentType,
        transferType: state.commonReducer.transferType,
        loginCurrentUser: state.loginUser.loginCurrentUser
    };
};

const mapDispatchToProps = function(dispatch: Dispatch) {
    return {
        dispatch: dispatch
    };
};

export const ReceiptuploadView = connect(mapStateToProps, mapDispatchToProps)(Receiptupload);