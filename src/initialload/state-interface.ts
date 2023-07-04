export interface IState {
    loginUser: {
        loggingIn: boolean, userLists: object[], loginCurrentUser: object, isHomeToLogin: boolean
    };
    menuList: {
        menus: any; isMenuSelect: boolean
    };
    alertReducer: {
        type: string, message: string
    };
    progress: {
        isProgress: boolean
    };
    commonReducer: {
        spentType: object[], transferType: object[]
    };
    receipt: {
        receiptGridData: any, caller: string, receiptHistoryData: any
    };
}