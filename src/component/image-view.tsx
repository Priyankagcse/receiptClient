import React from "react";

export function ImageView(props: any) {
  
    const fileRead = (e: any) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                if (props.onChange) {
                    props.onChange(props.field, reader.result);
                }
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    return (<>
        <img src={props.value}></img>
        <div className="col-sm-12 p-0 py-2">
            <input type={'file'} accept="image/*" onChange={fileRead}></input>
        </div>
    </>);
}