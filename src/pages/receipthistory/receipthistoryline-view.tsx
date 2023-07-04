import React, { useEffect } from "react";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Dialog, DialogContent, DialogTitle, IconButton, ImageList,
    ImageListItem, List, ListItem, MenuItem, MuiThemeProvider, Paper, Tab, Tabs, Toolbar, Typography } from "@material-ui/core";
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
import { TabPanel, tabProps } from "src/component/tab-view";
import { Aggregates } from "src/helper/Aggregates";
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { listStyles } from "src/commontheme-css";

function ReceiptHistoryLine(props: any) {
    const SPACED_DATE_FORMAT = "DD MMM YYYY";
    const [state, setState] = React.useState({isImageView: false, imageData: '', accordion: 'summary',
        allSource: [], gridData: [], monthSource: [], isInitial: true, tabIndex: 0,
        masterData: {}, summaryIndex: 0, typeIndex: 0, statementStr: '',
        sourceList: [], totalAmt: 0, creditAmt: 0, debitAmt: 0
    });
    const handleChange = (field: any, value: any) => {
        if (field === 'summaryIndex') {
            let statementStr = 'Category Report';
            if (+value === 1) {
                statementStr = 'Bank Report';
            } else if (+value === 2) {
                statementStr = 'Spent Report';
            }
            setState((prevState) => ({
                ...prevState,
                [field]: value,
                statementStr: statementStr
            }));
        } else if (field === 'typeIndex') {
            typeRefresh(field, value);
        } else if (typeof value === 'object') {
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

    const typeRefresh = (field: any, value: any) => {
        let sourceData: any = [];
        let sourceList: any = [];
        let totalAmt = 0;
        let creditAmt = 0;
        let debitAmt = 0;
        if (+value === 0) {
            sourceData = state.allSource.filter((line: any) => line.name === state.statementStr);
            sourceList = sourceData.length ? sourceData[0]['value'] : [];
            let creditArr = sourceList.filter((line: any) => +line.transferId === 1);
            let debitArr = sourceList.filter((line: any) => +line.transferId === 2);
            creditAmt = Aggregates.sum(creditArr, 'value');
            debitAmt = Aggregates.sum(debitArr, 'value');
            totalAmt =  creditAmt - debitAmt;
        } else {
            sourceData = state.allSource.filter((line: any) => line.name === state.statementStr && +line.transferId === +value);
            sourceList = sourceData.length ? sourceData[0]['value'] : [];
            totalAmt = Aggregates.sum(sourceList, 'value');
        }
        setState(prevState => ({
            ...prevState,
            [field]: value,
            sourceData: sourceData,
            sourceList: sourceList,
            chartData: state.allSource.filter((line: any) => line.name === state.statementStr),
            totalAmt: totalAmt,
            creditAmt: creditAmt,
            debitAmt: debitAmt
        }));
    }

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
                    {name: 'Category Report', value: res.sumOfCategory, borderColor: 'rgb(255, 99, 132)', backgroundColor: ['peachpuff']},
                    {name: 'Bank Report', value: res.sumOfBank, borderColor: 'rgb(255, 99, 132)', backgroundColor: ['peachpuff']},
                    {name: 'Spent Report', value: res.sumOfSpent, borderColor: 'rgb(255, 99, 132)', backgroundColor: ['peachpuff']}
                ];
                let monthSource = [
                    {name: 'Category Report', value: JSON.parse(monthlyExpenseSpecificData.categoryTypes || '[]') || [],
                        borderColor: 'rgb(255, 99, 132)', backgroundColor: ['pink']},
                    {name: 'Bank Report', value: JSON.parse(monthlyExpenseSpecificData.bankNames || '[]') || [],
                        borderColor: 'rgb(255, 99, 132)', backgroundColor: ['pink']}
                ];
                handleChange('gridData', { masterData: res, gridData: res.receiptData, allSource: source, monthSource: monthSource, isInitial: false });
            }));
        }
        typeRefresh('typeIndex', state.typeIndex);
    }, [state.summaryIndex]);

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

    let creditList = (state.masterData['sumOfCategory'] || []).filter((line: any) => +line.transferId === 1);
    let debitList = (state.masterData['sumOfCategory'] || []).filter((line: any) => +line.transferId === 2);
    const listClasses = listStyles();
    return (<>
        <div className={"col-sm-12 bg-light a-appbar " + (props.caller === 'home' ? 'd-none' : '')}>
            <Toolbar className="border-bottom bg-white a-sticky-t0-z101">
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={props.onClose}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" className="fw-bold">{props.monthlyDayText} History</Typography>
            </Toolbar>
        </div>
        <div className="position-relative" style={{zIndex: 1}}>
            <Paper square elevation={0} className="border-bottom">
                <Tabs value={state.tabIndex} indicatorColor="primary" textColor="primary"
                    onChange={(event: any, value: number) => handleChange('tabIndex', value)}>
                    <Tab label="Summary" className="col-4" {...tabProps(0)} />
                    <Tab label="Graph" className="col-4" {...tabProps(1)} />
                    <Tab label="Receipt Lists" className="col-4" {...tabProps(2)} />
                </Tabs>
            </Paper>
        </div>
        <div className="col-12 col-sm-12 row m-0 p-0 overflow-auto" style={{height: 'calc(100% - 113px)'}}>
            <TabPanel value={state.tabIndex} index={0} className='p-0'>
                <div className="row m-0 py-3 border-bottom">
                    <div className="text-center col-6">
                        <div>Credit Amount</div>
                        <div className="fw-bold">{number2FormatFn(Aggregates.sum(creditList, 'value'))}</div>
                    </div>
                    <div className="text-center col-6">
                        <div>Debit Amount</div>
                        <div className="fw-bold">{number2FormatFn(Aggregates.sum(debitList, 'value'))}</div>
                    </div>
                </div>
                <div className="position-relative" style={{zIndex: 1}}>
                    <Paper square elevation={0} className="border-bottom">
                        <Tabs value={state.summaryIndex} indicatorColor="primary" textColor="primary"
                            onChange={(event: any, value: number) => handleChange('summaryIndex', value)}>
                            <Tab label="Category" className="col-4" {...tabProps(0)} />
                            <Tab label="Bank" className="col-4" {...tabProps(1)} />
                            <Tab label="Spend" className="col-4" {...tabProps(2)} />
                        </Tabs>
                    </Paper>
                </div>
                <div className="pt-2">
                    <Paper square elevation={0}>
                        <Tabs value={state.typeIndex} indicatorColor="primary" textColor="primary"
                            onChange={(event: any, value: number) => handleChange('typeIndex', value)}>
                            <Tab label="All" className="col-4" {...tabProps(0)} />
                            <Tab label="Credit" className="col-4" {...tabProps(1)} />
                            <Tab label="Debit" className="col-4" {...tabProps(2)} />
                        </Tabs>
                    </Paper>
                </div>
                <div className="col-12 col-sm-3 p-3">
                    {state.sourceList.map((line: any, lineInd: number) => {
                        return <MenuItem className={((lineInd === state.sourceList.length - 1) ? '' : 'border-bottom') + " col-12 row m-0 p-0"} key={lineInd}>
                            <div className="col-6 p-0">
                                <span className="text-secondary text-capitalize">{line.name}</span>
                                {+state.tabIndex === 0 ? <>
                                    {+line.transferId === 1 ? <ArrowRightAltIcon style={{transform: `rotate(270deg)`, color: 'green'}} /> :
                                        <ArrowRightAltIcon style={{transform: `rotate(90deg)`, color: 'red'}} />}
                                </> : <></>}
                            </div>
                            <div className="col-6 p-0 fw-bold" align="right">{number2FormatFn(line.value)}</div>
                        </MenuItem>;
                    })}
                    {state.sourceList.length ? <MenuItem className="col-12 row m-0 p-0" style={{borderTop: '1px solid black', borderBottom: '1px solid black'}}>
                        <div className="col-6 p-0 fw-bold text-capitalize">Total</div>
                        <div className="col-6 p-0 fw-bold" align="right">
                        {+state.tabIndex === 0 ? <>
                            <span>{state.creditAmt}</span>
                            <ArrowRightAltIcon style={{transform: `rotate(270deg)`, color: 'green'}} />
                            <span className="px-2">-</span>
                            <span>{state.debitAmt}</span>
                            <ArrowRightAltIcon style={{transform: `rotate(90deg)`, color: 'red'}} />
                            <span className="px-2">=</span>
                            <span>{state.totalAmt}</span>
                        </> : <span>{state.totalAmt}</span>}
                        </div>
                    </MenuItem> : <></>}
                </div>
            </TabPanel>
            <TabPanel value={state.tabIndex} index={1} className='p-0'>
                <div className="py-2">
                    <ReceiptChartView allSource={state.allSource} monthSource={state.monthSource}></ReceiptChartView>
                </div>
            </TabPanel>
            <TabPanel value={state.tabIndex} index={2} className='p-0'>
                <div className="py-2">
                    <List className={listClasses.root + (state.gridData.length ? ' d-block' : ' d-none')}>
                        {state.gridData.map((line: any, ind: number) => {
                            return <ListItem className="border-bottom">
                                <div className={'col-12 col-sm-12 row m-0'}>
                                    <Avatar variant="rounded" src={line.image} onClick={() => {
                                        if (line.image) {
                                            handleChange('isImageView', {isImageView: true, imageData: line.image});
                                        } else {
                                            props.dispatch(alertAction.error('There is No Image'));
                                        }
                                    }}></Avatar>
                                    <div className="col">
                                        <div>{line.categoryTypeName}</div>
                                        <div className="text-secondary">{moment(new Date(line.billDate)).format(SPACED_DATE_FORMAT)}</div>
                                        <div className="fw-bold">{number2FormatFn(line.amount)}</div>
                                    </div>
                                </div>
                            </ListItem>
                        })}
                    </List>
                </div>
            </TabPanel>
        </div>
        <div className="a-appbar-minus d-none">
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