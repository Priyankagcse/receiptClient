import React, { useEffect } from "react";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { apiActions } from "src/action/action";
import { RECEIPTHISTORHEADERYAPI } from "src/apiurl";
import { getStartAndEndDate } from "src/common";
import moment from "moment";
import EditIcon from '@material-ui/icons/Edit';
import { ReceiptHistoryLineView } from "./receipthistoryline-view";
import { IconButton, Toolbar, Typography } from "@material-ui/core";
import { menuListAction } from "../menulists/menulists-reducer";
import { history } from "src/helper/history";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

function ReceiptHistoryHeader(props: any) {
    const SPACED_DATE_FORMAT = "DD MMM YYYY";
    const [state, setState] = React.useState({historyHeaderData: [], headerData: {}, isInitial: true});
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
            gridData();
        }
    });

    const gridData = () => {
        props.dispatch(apiActions.methodAction('get', RECEIPTHISTORHEADERYAPI().GET, {}, (result: any) => {
            handleChange('historyHeaderData', {'historyHeaderData': result.data, isInitial: false});
        }));
    };
    
    return (<>
        {state.headerData['uuid'] ? <ReceiptHistoryLineView headerData={state.headerData}
            onClose={() => handleChange('headerData', {headerData: {uuid: ''}})} caller={'history'}></ReceiptHistoryLineView> :
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
                        <Typography variant="h6">Receipt History</Typography>
                    </Toolbar>
                </div>
                <div className="a-appbar-minus">
                    {state.historyHeaderData.map((headerData: any, index: number) => {
                        let getdatePeriod = getStartAndEndDate(headerData.createdOn);
                        let monthlyDayText = `${moment(new Date(getdatePeriod.startDay)).format(SPACED_DATE_FORMAT)} - ${moment(new Date(getdatePeriod.endDay)).format(SPACED_DATE_FORMAT)}`;
                        return <div key={index} className="p-2 mb-2 bg-white fw-bold row m-0 border-bottom a-cursor-pointer"
                            onClick={() => handleChange('headerData', {headerData: headerData, monthlyDayText: monthlyDayText})}>
                            <div className={'row m-0'}>
                                <div className="col p-0 py-1">{monthlyDayText}</div>
                                <div style={{width: '40px'}} className={'px-2'}>
                                    <EditIcon fontSize={'medium'} className="text-secondary"></EditIcon>
                                </div>
                            </div>
                            <div className="col-12 col-sm-12">
                                <span className="text-secondary">Total Amount: </span>
                                <span>{headerData.amount}</span>
                            </div>
                        </div>;
                    })}
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

export const ReceiptHistoryHeaderView = connect(mapStateToProps, mapDispatchToProps)(ReceiptHistoryHeader);