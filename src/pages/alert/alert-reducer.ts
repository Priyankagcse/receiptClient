export let defaultValue = {
    message: '',
    type: ''
};

export const alertConstants = {
    SUCCESS: 'ALERT_SUCCESS',
    ERROR: 'ALERT_ERROR',
    WARNING: 'ALERT_WARNING',
    CLEAR: 'ALERT_CLEAR'
};

export const alertAction = {
    success: success,
    error: error,
    warning: warning,
    clear: clear
};

function success(message: any) {
    return { type: alertConstants.SUCCESS, message: message };
}

function error(message: any) {
    return { type: alertConstants.ERROR, message: message };
}

function warning(message: any) {
    return { type: alertConstants.WARNING, message: message };
}

function clear() {
    return { type: alertConstants.CLEAR };
}

export function alertReducer(state = defaultValue, action: any) {
    switch (action.type) {
        case alertConstants.SUCCESS:
            return { ...state, type: 'alert-success', message: action.message };
        case alertConstants.ERROR:
            return { ...state, type: 'alert-error', message: action.message };
        case alertConstants.WARNING:
            return { ...state, type: 'alert-warning', message: action.message };
        case alertConstants.CLEAR:
            return { ...state, message: '' };
        default:
            return state;
    }
}