import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { menuListAction } from "./menulists-reducer";
import AddIcon from '@material-ui/icons/Add';
import { ButtonView } from "src/component/button-view";

function MenuPage(props: any) {
    let width = (window.innerWidth - 32) / 3;
    return (<>
        <div className="m-3">
            <div className="d-flex align-items-center justify-content-center">
                {props.menus.map((menuObj: any, index: number) => {
                    return <div className={index === 1 ? "mx-2 p-0" : "p-0"} style={{width: width - 8}}>
                        <Link className={'text-decoration-none'} to={{ pathname: menuObj.pathName, state: menuObj }}>
                            <ButtonView variant="contained" color="primary" style={{fontSize: '12px', display: 'unset', borderRadius: '10px'}}
                                onClick={() => props.dispatch(menuListAction.menuSelection(true))}>
                                    <div className="p-2"><AddIcon></AddIcon></div>
                                    <div className="px-2">{menuObj.displayName}</div>
                            </ButtonView>
                        </Link>
                    </div>;
                })}
            </div>
        </div>
    </>);
}

const mapStateToProps = function(state: IState) {
    return {
        menus: state.menuList.menus
    };
};

const mapDispatchToProps = function(dispatch: Dispatch) {
    return {
        dispatch: dispatch
    };
};

export const MenuPageView = connect(mapStateToProps, mapDispatchToProps)(MenuPage);