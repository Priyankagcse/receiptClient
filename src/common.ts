import moment from "moment";
import CryptoJS from "crypto-js";

export function addCreatedBy(data: any) {
    data.createdOn = moment(new Date()).format("YYYY-MM-DD h:mm:ss");
    return data;
}

export function addModifyedBy(data: any) {
    data.lastModifiedOn = moment(new Date()).format("YYYY-MM-DD h:mm:ss");
    return data;
}

export function getStartAndEndDate(value: any) {
    let date = new Date(value);
    let startDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let endDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { startDay: startDay, endDay: endDay };
}

export function getStartAndEndDateBasedOnMonth(value: any) {
    let startDay = new Date(new Date().getFullYear(), value, 1);
    let endDay = new Date(new Date().getFullYear(), value + 1, 0);
    return { startDay: startDay, endDay: endDay };
}

export function toLowerCaseNoSpace(value: any) {
    return (value.toLowerCase()).replaceAll(' ', '');
}

export function number2FormatFn(value: any) {
    return +value > 0 ? (+value).toFixed(2) : '0.00';
}

export function encryptedData(value: any) {
    return CryptoJS.AES.encrypt(JSON.stringify(value), "XkhZG4fW2t2W").toString();
}

export function decryptData(value: any) {
    const decryptData = CryptoJS.AES.decrypt(value, "XkhZG4fW2t2W");
    return JSON.parse(decryptData.toString(CryptoJS.enc.Utf8));
}

export function passwordValidate(value: any) {
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(value) ? false : true;
}

export function emailValidate(value: any) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) ? false : true;
}

export function mobileValidate(value: any) {
    return value.length === 10 ? false : true;
}

export function isNullOrUndefinedOrEmpty(value: any) {
    return value === undefined || value === null || value === '';
}

export function isNullOrUndefined(value: any) {
    return value === undefined || value === null;
}

export function getVal(array: object[], index: number, field?: string): any {
    return field ? getObject(field, array[index]) : array[index];
}

export function getObject(field = '', object: object): any {
    if (field) {
        let value = object;
        let splits = field.split('.');
        for (let i = 0; i < splits.length && !isNullOrUndefined(value); i++) {
            value = value[splits[i]];
        }
        return value;
    }
    return '';
}

export function getItemFromComparer(array: object[], field: string, comparer: Function): object {
    let keyVal: number;
    let current: number;
    let key: object;
    let i: number = 0;
    let castRequired: boolean = typeof getVal(array, 0, field) === 'string';
    if (array.length) {
        while (isNullOrUndefined(keyVal) && i < array.length) {
            keyVal = getVal(array, i, field);
            key = array[i++];
        }
    }
    for (; i < array.length; i++) {
        current = getVal(array, i, field);
        if (isNullOrUndefined(current)) {
            continue;
        }
        if (castRequired) {
            keyVal = +keyVal;
            current = +current;
        }
        if (comparer(keyVal, current) > 0) {
            keyVal = current;
            key = array[i];
        }
    }
    return key;
}