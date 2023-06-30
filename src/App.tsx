import * as React from 'react';
import './global';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import ReactDOM from 'react-dom';
import { ClientAppView } from './pages/clientapp-view';
import { rootReducer } from './initialload/root-reducer';
import { IState } from './initialload/state-interface';
import './styles/common.scss';
import './styles/material-common.scss';
import './styles/fabric.scss';
import { MuiThemeProvider } from '@material-ui/core';
import { theme } from './commontheme-css';

declare module 'react' {
    interface HTMLAttributes<T> {
        uid?: string;
        align?: string;
        indeterminate?: boolean;
    }
}

export function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <ClientAppView></ClientAppView>
        </MuiThemeProvider>
    );
}

// let stringData = localStorage.getItem(`nila-${localStorage.getItem('loginUser')}`);
let stringData = '';
let previousData: IState = {} as IState;
if (stringData) {
    try {
        previousData = JSON.parse(stringData) || {};
    } catch {
        previousData = {} as IState;
    }
}

export const store = createStore(
    rootReducer,
    {} || previousData,
    applyMiddleware(thunkMiddleware)
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root') as HTMLElement
);

function saveonClose() {
    saveLocalData();
    window.removeEventListener('beforeunload', saveonClose);
}

window.addEventListener('beforeunload', saveonClose);

window.onerror = () => {
    // localStorage.removeItem(`nila-${localStorage.getItem('loginUser')}`);
};

function saveLocalData() {
    let state: IState = store.getState() as IState;
    if (state.loginUser.loggingIn) {
        saveData(store.getState() as IState);
    }
}

// registerServiceWorker.register();

export function saveData(state: object) {
    try {
        // localStorage.setItem(`nila-${localStorage.getItem('loginUser')}`, stringifyData(state));
    } catch {
        console.log('Backup Failed');
    }
}

export function stringifyData(state: object) {
    let currentData = '';
    try {
        currentData = JSON.stringify(state, (key: string, value: object) => {
            return value;
        });
    } catch {
        currentData = '';
    }
    return currentData;
}