import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { apiActions } from "src/action/action";

function DropDown(props: any) {

    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        if (props.dataSourceUrl) {
            props.dispatch(apiActions.methodAction('get', props.dataSourceUrl, {}, (result: any) => setDataSource(result.data || [])));
        } else if (props.dataSource) {
            setDataSource(props.dataSource);
        }
    }, [props.dataSource]);
    
    return (<>
        <FormControl className={props.className || "col-sm-12"} required={props.required}>
            <InputLabel>{props.label}</InputLabel>
            {dataSource.length ? <Select value={props.value} className={'text-capitalize'} disabled={props.disabled}>
                {(dataSource || []).map((line: any, ind: number) => {
                    return <MenuItem className="text-capitalize" value={line[props.fields.value]} key={ind}
                        onClick={(event: any) => {
                            props.onChange(props.field, line[props.fields.value], line);
                        }}>{line[props.fields.text]}
                    </MenuItem>;
                })}
                {props.footerTemlate && props.footerTemlate()}
            </Select> : <Select value={props.value} className={'text-capitalize'}>
                <MenuItem>No Records Found</MenuItem>
                {props.footerTemlate && props.footerTemlate()}
            </Select>}
        </FormControl>
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

export const DropDownView = connect(mapStateToProps, mapDispatchToProps)(DropDown);