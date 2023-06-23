import React from "react";
import { AppBarView } from "src/component/appbar-view";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { ReceiptHistoryLineView } from "./receipthistory/receipthistoryline-view";

function HomePage(props: any) {
    
    return (<>
        <AppBarView></AppBarView>
        <ReceiptHistoryLineView headerData={{}} caller={'home'}></ReceiptHistoryLineView>
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

export const HomePageView = connect(mapStateToProps, mapDispatchToProps)(HomePage);