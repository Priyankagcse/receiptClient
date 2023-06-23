export let defaultValue = {
    isProgress: false
};

export const progressConstants = {
    SHOW: 'PROGRESS_SHOW',
    HIDE: 'PROGRESS_HIDE'
};

export const progressAction = {
    show: show,
    hide: hide
};

function show() {
    return { type: progressConstants.SHOW };
}

function hide() {
    return { type: progressConstants.HIDE };
}

export function progress(state = defaultValue, action: any) {
    switch (action.type) {
        case progressConstants.SHOW:
            return { ...state, isProgress: true };
        case progressConstants.HIDE:
            return { ...state, isProgress: false };
        default:
            return state;
    }
}