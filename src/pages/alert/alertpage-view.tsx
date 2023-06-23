import React from "react";
import ReactDOM from "react-dom";

export class AlertPage extends React.Component<any, any> {
    public modelElement: any;

    constructor(props: any) {
        super(props);
        this.state = {};
        this.modelElement = document.createElement('div');
        this.modelElement.id = 'model-root';
        this.modelElement.className = 'model-element';
    }

    componentDidMount() {
        document.body.appendChild(this.modelElement);
    }

    componentWillUnmount() {
        document.body.removeChild(this.modelElement);
    }
    
    render() {
        let template = <></>;
        if (this.props.open) {
            setTimeout(() => { this.props.onClose(); }, this.props.autoHideDuration || 3000);
            template = <div className={"a-alert-dialog"}>
                <span id="alert-message">{this.props.message}</span>
            </div>;
        }
        return ReactDOM.createPortal(template, this.modelElement);
    }
}