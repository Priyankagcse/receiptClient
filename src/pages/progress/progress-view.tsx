import { CircularProgress } from "@material-ui/core";
import React from "react";

export function ProgressView(props: any) {
    return (<>
        {props.isProgress ? <div className="a-progress-center">
            <CircularProgress></CircularProgress>
        </div> : <></>}
    </>);
}