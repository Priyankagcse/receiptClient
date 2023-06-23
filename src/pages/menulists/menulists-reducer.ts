export let menuDefaultValue = {
    menus: [] as any,
    isMenuSelect: false
};

export interface IMenu {
    menus: any;
    isMenuSelect: boolean;
}

export interface IMenuAct {
    type: string;
    value: object;
}

export const menuConstants = {
    GET_MENULIST: 'GET_MENULIST',
    MENU_SELECTION: 'MENU_SELECTION'
};

export const menuListAction = {
    getMenuList: getMenuList,
    menuSelection: menuSelection
};

function getMenuList(value: any) {
    return { type: menuConstants.GET_MENULIST, value: value };
}

function menuSelection(value: any) {
    return { type: menuConstants.MENU_SELECTION, value: value };
}

export function menuList(state: IMenu = menuDefaultValue, action: IMenuAct) {
    switch (action.type) {
        case menuConstants.GET_MENULIST:
            return { ...state, menus: action.value };
        case menuConstants.MENU_SELECTION:
            return { ...state, isMenuSelect: action.value };
        default:
            return state;
    }
}