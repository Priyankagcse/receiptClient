import { API_URL } from "./config";

export const COMMONAPI = (firstParam?: any, secondParam?: any) => {
    return {
        RECEIPTRELATEDMASTER: API_URL + `getReceiptRelatedMaster/${firstParam}/${secondParam}`,
        INITIALREFRESH: API_URL + `getInitialRefresh`,
        VERSIONREFRESH: API_URL + `versionRefresh/${firstParam}/${secondParam}`
    };
};

export const USERAPI = (uuid?: string) => {
    return {
        GETBYID: API_URL + `getUser/${uuid}`,
        POST: API_URL + 'user',
        PUT: API_URL + 'user'
    };
};

export const BANKAPI = () => {
    return {
        POST: API_URL + 'bankDetails'
    };
};

export const CATEGORYTYPEAPI = () => {
    return {
        POST: API_URL + 'categoryType'
    };
};

export const RECEIPTUPLOADAPI = () => {
    return {
        POST: API_URL + 'receiptUpload',
        PUT: API_URL + 'receiptUpload',
    };
};

export const RECEIPTHISTORHEADERYAPI = () => {
    return {
        GET: API_URL + 'receiptHistoryHeader'
    };
};

export const MONTHLYEXPENSE = (uuid?: string) => {
    return {
        GET: API_URL + 'monthlyExpense',
        POST: API_URL + 'monthlyExpense',
        PUT: API_URL + 'monthlyExpense'
    };
};