import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ButtonView } from 'src/component/button-view';
import { MonthlyExpenseView } from 'src/pages/monthlyexpense/monthlyexpense-view';
import { ReceiptHistoryHeaderView } from 'src/pages/receipthistory/receipthistoryheader-view';
import { ReceiptuploadView } from 'src/pages/receiptupload/receiptupload-view';
import { IState } from './state-interface';

function NotFound() {
    return <div className={'m-4'} align={'center'}>
        <h4>Page not found Or you didn't have permission to view the page</h4>
        <ButtonView className={'a-warning'}>Go Back</ButtonView>
    </div>;
}


function HomeRouterView(props: any) {

    const generateMenuObj = (menu: any) => {
        let path: string = menu.pathTemplate;
        if (!path) {
            path = '/home/' + ((menu.menuName || '').replace(/\s/g, ''));
        }
        return {
            path: path, name: menu.menuName, Component: getComponent(menu.menuName), isExact: true
        };
    };

    const getComponent = (name: string) => {
        switch (name) {
            case 'monthlyExpense':
                return MonthlyExpenseView;
            case 'receiptUpload':
                return ReceiptuploadView;
            case 'receiptHistory':
                return ReceiptHistoryHeaderView;
            default:
                return () => <NotFound></NotFound>;
        }
    };

    let routes: any[] = props.menus;
    routes = routes.map((menu: any, index: number) => {
        let model = generateMenuObj(menu);
        return <Route key={index} exact={!!model.isExact} path={model.path} component={model.Component}></Route>;
    });
    return (<React.Fragment>
        <Switch>
            {routes}
            <Route path='/*' component={NotFound} />
        </Switch>
    </React.Fragment>);
}

function mapStateToProps(state: IState) {
    return {
        menus: state.menuList.menus
    };
}

export const HomeRouter = connect(mapStateToProps)(HomeRouterView);