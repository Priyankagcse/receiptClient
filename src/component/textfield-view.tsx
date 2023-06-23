import { TextField } from "@material-ui/core";
import React from "react";
import { isNullOrUndefinedOrEmpty } from "src/common";

export function TextFieldView(props: any) {
  
    const [error, setError] = React.useState(false);
    let id = "standard-basic";
    let variant: any = "standard";
    if (false) {
        id = "outlined-basic";
        variant = "outlined";
    }
    if (props.id) {
        id = props.id;
    }
    if (props.outlined) {
        variant = props.variant;
    }

    const onBlurAct = (event: any) => {
        if (props.onBlur) {
            props.onBlur(event, props.field, props.value);
        }
        if (props.required && isNullOrUndefinedOrEmpty(props.value)) {
            setError(true);
        } else {
            setError(false);
        }
    };

    const numberInputOnWheelPreventChange = (event: any) => {
        if (props.type === 'number') {
            event.target.blur();
            event.stopPropagation();
            setTimeout(() => {
                event.target.focus();
            }, 0);
        }
    };

    return (<>
        <TextField id={id} label={props.label} type={props.type} variant={variant} className={props.className}
            onChange={(value: any) => props.onChange(props.field, value.target.value)} value={props.value} error={error}
            onBlur={onBlurAct} defaultValue={props.defaultValue} multiline={props.multiline}
            rows={props.rows} required={props.required} onKeyDown={props.onKeyDown} placeholder={props.placeholder}
            disabled={props.disabled} inputProps={props.inputProps} onWheel={numberInputOnWheelPreventChange}
            onKeyUp={props.onKeyUp} />
    </>);
}