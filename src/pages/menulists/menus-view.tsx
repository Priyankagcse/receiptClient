import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { menuListAction } from "./menulists-reducer";
import { AppBarView } from "src/component/appbar-view";
import AddIcon from '@material-ui/icons/Add';
import { ButtonView } from "src/component/button-view";

function MenuPage(props: any) {
    return (<>
        <AppBarView></AppBarView>
        <div className="col-12 col-sm-12 row m-0 p-0" style={{height: 'calc(100% - 64px)'}}>
            {props.menus.map((menuObj: any, index: number) => {
                return <div className="my-2" style={{height: '100px', width: 'auto'}}>
                    <Link className={'text-decoration-none'} to={{ pathname: menuObj.pathName, state: menuObj }}>
                        <ButtonView variant="contained" color="primary" style={{fontSize: '12px'}}
                            onClick={() => props.dispatch(menuListAction.menuSelection(true))} startIcon={<AddIcon></AddIcon>}>
                                <div className="px-2">{menuObj.displayName}</div>
                        </ButtonView>
                    </Link>
                </div>;
            })}
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