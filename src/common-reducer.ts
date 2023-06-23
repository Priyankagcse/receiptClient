export let defaultValue = {
    spentType: [] as any,
    transferType: [] as any
};

export const commonConstants = {
    SPENTTYPE: 'COMMON_SPENTTYPE',
    TRANSFERTYPE: 'COMMON_TRANSFERTYPE'
};

export const commonAction = {
    spentType: spentType,
    transferType: transferType
};

function spentType(value: any) {
    return { type: commonConstants.SPENTTYPE, value: value };
}

function transferType(value: any) {
    return { type: commonConstants.TRANSFERTYPE, value: value };
}

export function commonReducer(state = defaultValue, action: any) {
    switch (action.type) {
        case commonConstants.SPENTTYPE:
            return { ...state, spentType: action.value };
        case commonConstants.TRANSFERTYPE:
            return { ...state, transferType: action.value };
        default:
            return state;
    }
}