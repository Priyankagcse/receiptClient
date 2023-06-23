import { Button } from "@material-ui/core";
import React from "react";

export function ButtonView(props: any) {
    return (<>
        <Button color={props.color} variant={props.variant} onClick={props.onClick} startIcon={props.startIcon}
            className={props.className} style={props.style}>
            {props.children}
        </Button>
    </>);
}