import React, { useEffect } from "react";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Dialog, DialogContent, DialogTitle, IconButton, ImageList,
    ImageListItem, MenuItem, MuiThemeProvider, Toolbar, Typography } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import moment from "moment";
import { createMuiTheme } from "@material-ui/core/styles";
import { Browser } from "src/helper/browser";
import { number2FormatFn } from "src/common";
import { alertAction } from "../alert/alert-reducer";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ReceiptChartView } from "../receiptupload/receiptchart";
import { apiActions } from "src/action/action";
import { COMMONAPI } from "src/apiurl";

function ReceiptHistoryLine(props: any) {
    const SPACED_DATE_FORMAT = "DD MMM YYYY";
    const [state, setState] = React.useState({isImageView: false, imageData: '', accordion: 'summary',
        allSource: [], gridData: [], monthSource: [], isInitial: true});
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

    const options: any = {
        filter: true,
        selectableRows: false,
        filterType: 'dropdown',
        responsive: 'stacked',
        rowsPerPage: 10
    };

    const columns: any = [
        { label: 'Bill Date', name: 'billDate', options: { sortDirection: 'desc',
            customBodyRender: (value: any) => moment(new Date(value)).format(SPACED_DATE_FORMAT) } },
        { label: 'Category Type', name: 'categoryTypeName' },
        { label: 'Bank Details', name: 'bankName' },
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
            props.dispatch(apiActions.methodAction('get', COMMONAPI(props.caller, props.headerData.uuid).RECEIPTRELATEDMASTER, {}, (res: any) => {
                let monthlyExpenseSpecificData = res.monthlyExpenseData.length ? res.monthlyExpenseData[0] : {};
                let source = [
                    {name: 'Categorywise', value: res.sumOfCategory, borderColor: 'rgb(255, 99, 132)', backgroundColor: ['pink']},
                    {name: 'Bankwise Details', value: res.sumOfBank, borderColor: 'rgb(255, 99, 132)', backgroundColor: ['aquamarine']},
                    {name: 'Spent Type Details', value: res.sumOfSpent, borderColor: 'rgb(255, 99, 132)', backgroundColor: ['cornflowerblue']}
                ];
                let monthSource = [
                    {name: 'Categorywise', value: JSON.parse(monthlyExpenseSpecificData.categoryTypes || '[]') || [],
                        borderColor: 'rgb(255, 99, 132)', backgroundColor: ['red']},
                    {name: 'Bankwise Details', value: JSON.parse(monthlyExpenseSpecificData.bankNames || '[]') || [],
                        borderColor: 'rgb(255, 99, 132)', backgroundColor: ['red']},
                ];
                handleChange('gridData', { gridData: res.receiptData, allSource: source, monthSource: monthSource, isInitial: false });
            }));
        }
    }, []);

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
                    top: '64px',
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
    
    return (<>
        <div className={"col-sm-12 bg-light a-appbar " + (props.caller === 'home' ? 'd-none' : '')}>
            <Toolbar className="border-bottom bg-white a-sticky-t0-z101">
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={props.onClose}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6">{props.headerData.monthlyDayText} History</Typography>
            </Toolbar>
        </div>
        <div className="a-appbar-minus">
            <Accordion square expanded={state.accordion === 'summary'} onChange={() => handleChange('accordion', 'summary')}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
                    <Typography className="fw-bold">Summary</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="col-12 col-sm-12 row m-0 bg-white mb-2">
                        <div className="col-12 col-sm-3 fw-bold ps-0">
                            Total Amount: {props.headerData.amount}
                        </div>
                        {state.allSource.map((header: any, headerInd: number) => {
                            return <div className="col-12 col-sm-3 ps-0" key={headerInd}>
                                <div className="fw-bold pb-2">{header.name}</div>
                                {header.value.map((line: any, lineInd: number) => {
                                    return <MenuItem className="col-12 row m-0 p-0" key={lineInd}>
                                        <div className="col-6 p-0 text-secondary text-capitalize">{line.name}</div>
                                        <div className="col-6 p-0 fw-bold" align="right">{number2FormatFn(line.value)}</div>
                                    </MenuItem>;
                                })}
                            </div>;
                        })}
                    </div>
                </AccordionDetails>
            </Accordion>
            <Accordion square expanded={state.accordion === 'graph'} onChange={() => handleChange('accordion', 'graph')}>
                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header" expandIcon={<ExpandMoreIcon />}>
                    <Typography className="fw-bold">Graph</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ReceiptChartView allSource={state.allSource} monthSource={state.monthSource}></ReceiptChartView>
                </AccordionDetails>
            </Accordion>
            <Accordion square expanded={state.accordion === 'grid'} onChange={() => handleChange('accordion', 'grid')}
                className={props.caller === 'home' ? 'd-none' : ''}>
                <AccordionSummary aria-controls="panel3d-content" id="panel3d-header" expandIcon={<ExpandMoreIcon />}>
                    <Typography className="fw-bold">History Lines</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="col-12 col-sm-12">
                        <MuiThemeProvider theme={getMuiTheme}>
                            <MUIDataTable columns={columns} data={state.gridData} options={options} title={''} />
                        </MuiThemeProvider>
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
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
    </>);
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

export const ReceiptHistoryLineView = connect(mapStateToProps, mapDispatchToProps)(ReceiptHistoryLine);