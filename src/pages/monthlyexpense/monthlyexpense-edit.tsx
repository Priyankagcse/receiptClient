import React, { useEffect } from "react";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { IconButton, Toolbar, Typography } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { TextFieldView } from "src/component/textfield-view";
import { DatePickerView } from "src/component/datepicker-view";
import { CategoryTypeView } from "../mastercomponent/categorytype-view";
import { BankDetailsView } from "../mastercomponent/bank-view";
import { apiActions } from "src/action/action";
import { COMMONAPI, MONTHLYEXPENSE } from "src/apiurl";
import { getStartAndEndDateBasedOnMonth, isNullOrUndefinedOrEmpty } from "src/common";
import { Aggregates } from "src/helper/Aggregates";
import { alertAction } from "../alert/alert-reducer";
import moment from "moment";
import SaveIcon from '@material-ui/icons/Save';
import { ButtonView } from "src/component/button-view";
import AddIcon from '@material-ui/icons/Add';
import { DropDownView } from "src/component/dropdown-view";

const monthLists = [
    { text: 'January', value: 0 },
    { text: 'February', value: 1 },
    { text: 'March', value: 2 },
    { text: 'April', value: 3 },
    { text: 'May', value: 4 },
    { text: 'June', value: 5 },
    { text: 'July', value: 6 },
    { text: 'August', value: 7 },
    { text: 'September', value: 8 },
    { text: 'October', value: 9 },
    { text: 'November', value: 10 },
    { text: 'December', value: 11 }
];

function MonthlyExpenseEdit(props: any) {
    let stateObj: any = { fromDate: new Date(), toDate: new Date(), totalAmount: 0, expenseAmount: 0, templateName: '',
        isCategoryType: false, dropDownSource: [], isBankName: false, bankDropDownSource: [],
        isInitial: true, categoryTypes: [], bankNames: [], expenseMonth: '' };
    if (props.headerData.uuid) {
        stateObj = {isCategoryType: false, dropDownSource: [], isBankName: false, bankDropDownSource: [],
            isInitial: true, ...props.headerData, categoryTypes: JSON.parse(props.headerData.categoryTypes),
            bankNames: JSON.parse(props.headerData.bankNames)
        };
    }

    const [state, setState] = React.useState(stateObj);
    const handleChange = (field: any, value: any) => {
        if (typeof value === 'object' && field !== 'fromDate' && field !== 'toDate') {
            setState((prevState: any) => ({
                ...prevState,
                ...value
            }));
        } else if (field === 'expenseMonth') {
            setState((prevState: any) => ({
                ...prevState,
                [field]: value,
                templateName: `${monthLists[value]['text']} Expense Template`,
                fromDate: getStartAndEndDateBasedOnMonth(value).startDay,
                toDate: getStartAndEndDateBasedOnMonth(value).endDay
            }));
        } else {
            setState((prevState: any) => ({
                ...prevState,
                [field]: value
            }));
        }
    };

    const amountOnChanges = (field: any, value: any, object: any) => {
        let arr: object[] = [];
        let obj = {};
        let allocatedAmt = 0;
        if (field === "categoryTypes") {
            arr = state.categoryTypes;
            obj = {uuid: object.uuid, name: object.categoryTypeName, amount: value};
            allocatedAmt = Aggregates.sum(state.bankNames, 'amount');
        } else if (field === "bankNames") {
            arr = state.bankNames;
            obj = {uuid: object.uuid, name: object.bankName, amount: value};
            allocatedAmt = Aggregates.sum(state.categoryTypes, 'amount');
        }
        if (arr.length) {
            let filterData = arr.filter((line: any) => line.uuid === object.uuid);
            if (filterData.length) {
                arr = arr.map((line: any) => {
                    if (line.uuid === object.uuid) {
                        return obj;
                    }
                    return line;
                });
            } else {
                arr.push(obj);
            }
        } else {
            arr.push(obj);
        }
        if (state.totalAmount < allocatedAmt + Aggregates.sum(arr, 'amount')) {
            props.dispatch(alertAction.error('Allocated Amount Greater than the Current Total amount'));
        } else {
            setState((prevState: any) => ({
                ...prevState,
                [field]: arr
            }));
        }
    };

    useEffect(() => {
        if (state.isInitial) {
            props.dispatch(apiActions.methodAction('get', COMMONAPI('monthlyExpense', null).RECEIPTRELATEDMASTER, {}, (res: any) => {
                handleChange('gridData', { dropDownSource: res.categoryData, bankDropDownSource: res.bankData, isInitial: false });
            }));
        }
        let totCategory = Aggregates.sum(state.categoryTypes, 'amount');
        handleChange('expenseAmount', totCategory);
    }, [state.categoryTypes]);

    const save = () => {
        let fromDate = new Date(new Date(state.fromDate).setHours(0, 0, 0, 0)).getTime();
        let toDate = new Date(new Date(state.toDate).setHours(0, 0, 0, 0)).getTime();
        let filterDate = props.getAllDatas.filter((date: any) =>
            (new Date(new Date(date.fromDate).setHours(0, 0, 0, 0)).getTime() <= fromDate &&
                new Date(new Date(date.toDate).setHours(0, 0, 0, 0)).getTime() >= fromDate) ||
            (new Date(new Date(date.fromDate).setHours(0, 0, 0, 0)).getTime() <= toDate &&
                new Date(new Date(date.toDate).setHours(0, 0, 0, 0)).getTime() >= toDate)
        );
        if (isNullOrUndefinedOrEmpty(state.expenseMonth)) {
            props.dispatch(alertAction.error('Please Choose Epense Month'));
        } else if (filterDate.length) {
            props.dispatch(alertAction.error('This date is already selected so you can use that template.'));
        } else {
            let data = {
                templateName: state.templateName,
                totalAmount: state.totalAmount,
                fromDate: moment(new Date(state.fromDate)).format("YYYY-MM-DD h:mm:ss"),
                toDate: moment(new Date(state.toDate)).format("YYYY-MM-DD h:mm:ss"),
                categoryTypes: (JSON.stringify(state.categoryTypes).toString())['replaceAll']('\\"', ''),
                bankNames: (JSON.stringify(state.bankNames).toString())['replaceAll']('\\"', ''),
                expenseAmount: state.expenseAmount,
                remainingAmount: +state.totalAmount - +state.expenseAmount,
                expenseMonth: state.expenseMonth
            };
            props.dispatch(apiActions.methodAction('post', MONTHLYEXPENSE().POST, data, (expense: any) => {
                props.onClose({...expense.data, fromDate: data.fromDate, toDate: data.toDate});
            }));
        }
    };

    return (<div className="col-sm-12 bg-light">
        <div className="a-appbar">
            <Toolbar className="border-bottom bg-white">
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => props.onClose()}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" className="flex-grow-1">Monthly Report</Typography>
                {isNullOrUndefinedOrEmpty(props.headerData.uuid) && <ButtonView color="inherit" onClick={save}
                    startIcon={<SaveIcon></SaveIcon>}>
                    <span className="px-1 pt-1 d-none d-sm-block">Save</span>
                </ButtonView>}
            </Toolbar>
        </div>
        <div className="col-sm-12 row m-0 a-appbar-minus">
            <div className="a-heavy-bold py-2 fw-bold bg-white">
                <span title="Current Total Amount">{`${state.totalAmount || 0} `}</span>
                <span className="text-secondary">{`(Tot Amt)`}</span> -
                <span title="Allocated Amount" className="ps-2">{`${state.expenseAmount || 0} `}</span>
                <span className="text-secondary">{`(All Amt)`}</span> =
                <span title="Remaining Amount" className="ps-2">{`${(state.totalAmount - state.expenseAmount) || 0} `}</span>
                <span className="text-secondary">{`(Remaining Amt)`}</span>
            </div>
            <div className="col-12 col-sm-4">
                <div className="col-6 fw-bold px-0 py-2">Summary</div>
                <div className="col-12 col-sm-12">
                    <DropDownView field={'expenseMonth'} label={'Expense Month'} value={state.expenseMonth} required
                        dataSource={monthLists} fields={{ text: 'text', value: 'value' }} onChange={handleChange}
                        className={'col-12 col-sm-12 MuiFormControl-marginNormal'}></DropDownView>
                </div>
                <div className="col-12 col-sm-12">
                    <TextFieldView label="Template Name" type={'text'} field={'templateName'} className={'col-12 col-sm-12 MuiFormControl-marginNormal'}
                        value={state.templateName} onChange={handleChange} />
                </div>
                <div className="col-12 col-sm-12">
                    <TextFieldView label="Current Total Amount" type={'text'} field={'totalAmount'} className={'col-12 col-sm-12 MuiFormControl-marginNormal'}
                        value={state.totalAmount} onChange={handleChange} />
                </div>
                <div className="col-12 col-sm-12">
                    <DatePickerView format={"dd/MM/yyyy"} label="From Date" className="col-12 col-sm-12"
                        value={state.fromDate} onChange={handleChange} field={'fromDate'}></DatePickerView>
                </div>
                <div className="col-12 col-sm-12">
                    <DatePickerView format={"dd/MM/yyyy"} label="To Date" className="col-12 col-sm-12"
                        value={state.toDate} onChange={handleChange} field={'toDate'} minDate={new Date(state.fromDate)}></DatePickerView>
                </div>
            </div>
            <div className="col-12 col-sm-4">
                <div className="col-12 p-0 row m-0">
                    <div className="col-6 fw-bold px-0 py-2">Category Types</div>
                    {isNullOrUndefinedOrEmpty(props.headerData.uuid) && <div className="col-12 col-sm-6" align="right">
                        <ButtonView variant="text" className="mx-2 text-primary"
                            onClick={() => handleChange('isCategoryType', true)}>
                            <AddIcon></AddIcon>
                            <span>Add Category Type</span>
                        </ButtonView>
                    </div>}
                </div>
                {state.dropDownSource.map((category: any, index: number) => {
                    let categoryTypeName = (state.categoryTypes || []).filter((line: any) => line.uuid === category.uuid);
                    let valObj = categoryTypeName[0] || {};
                    return <div className="col-12 col-sm-12" key={index}>
                        <TextFieldView type={'text'} field={category.uuid} label={category.categoryTypeName} placeholder={'Amount'}
                            className={'col-12 col-sm-12 MuiFormControl-marginNormal'} value={valObj['amount']}
                            onChange={(field: string, value: number) => amountOnChanges('categoryTypes', value, category)} />
                    </div>;
                })}
            </div>
            <div className="col-12 col-sm-4">
                <div className="col-12 p-0 row m-0">
                    <div className="col-6 fw-bold px-0 py-2">Bank Names</div>
                    {isNullOrUndefinedOrEmpty(props.headerData.uuid) && <div className="col-12 col-sm-6" align="right">
                        <ButtonView variant="text" className="mx-2 text-primary"
                            onClick={() => handleChange('isBankName', true)}>
                            <AddIcon></AddIcon>
                            <span>Add Bank Name</span>
                        </ButtonView>
                    </div>}
                </div>
                {state.bankDropDownSource.map((bank: any, index: number) => {
                    let bankName = (state.bankNames || []).filter((line: any) => line.uuid === bank.uuid);
                    let valObj = bankName[0] || {};
                    return <div className="col-12 col-sm-12" key={index}>
                        <TextFieldView type={'text'} field={bank.uuid} label={bank.bankName}
                            className={'col-12 col-sm-12 MuiFormControl-marginNormal'}
                            value={valObj['amount']} placeholder={'Enter Your Limited Amount'}
                            onChange={(field: string, value: number) => amountOnChanges('bankNames', value, bank)} />
                    </div>;
                })}
            </div>
        </div>
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
    </div>);
}

const mapStateToProps = function(state: IState) {
    return {
        spentType: state.commonReducer.spentType
    };
};

const mapDispatchToProps = function(dispatch: Dispatch) {
    return {
        dispatch: dispatch
    };
};

export const MonthlyExpenseEditView = connect(mapStateToProps, mapDispatchToProps)(MonthlyExpenseEdit);