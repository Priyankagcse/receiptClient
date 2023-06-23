import { getItemFromComparer, getObject, getVal } from "src/common";

export interface Aggregates {
    sum?: Function;
    average?: Function;
    min?: Function;
    max?: Function;
    truecount?: Function;
    falsecount?: Function;
    count?: Function;
    type?: string;
    field?: string;
    distinct?: Function;
    distinctWithData?: Function;
}

export let Aggregates: Aggregates = {
    sum: (ds: object[], field: string): number => {
        let result: number = 0;
        let val: number;

        for (let i: number = 0; i < ds.length; i++) {
            val = getVal(ds, i, field) as number;
            if (!isNaN(val) && val !== null) {
                result += (+val);
            }
        }
        return result;
    },

    average: (ds: object[], field: string): number => {
        return Aggregates.sum(ds, field) / ds.length;
    },

    min: (ds: object[], field: string | Function) => {
        let comparer: Function;
        if (typeof field === 'function') {
            comparer = <Function> field;
            field = null;
        }
        return getObject(<string> field, getItemFromComparer(ds, <string> field, comparer));
    },
    
    max: (ds: object[], field: string | Function) => {
        let comparer: Function;
        if (typeof field === 'function') {
            comparer = <Function> field;
            field = null;
        }
        return getObject(<string> field, getItemFromComparer(ds, <string> field, comparer));
    },

    count: (ds: object[] = [], field?: string): number => {
        return ds.length;
    },

    distinct: (ds: object[], distinctFields: string[]): object[] => {
        if (typeof distinctFields === 'string') {
            distinctFields = [distinctFields];
        }
        if (!ds || !ds.length) { return ds; }
        let temp: object = {};
        return ds.filter((obj: object) => {
            let val: string = distinctFields.map((field: string) => {
                return getObject(field, obj);
            }).join('|');
            if (!(val in temp)) {
                temp[val] = true;
                return true;
            }
            return false;
        });
    },

    distinctWithData: (ds: object[], distinctFields: string[]): object => {
        if (typeof distinctFields === 'string') {
            distinctFields = [distinctFields];
        }
        if (!ds || !ds.length) { return ds; }
        let temp: object = {};
        ds.forEach((obj: object) => {
            let val: string = distinctFields.map((field: string) => {
                return getObject(field, obj);
            }).join('|');
            if (!(val in temp)) {
                temp[val] = [obj];
                return true;
            } else {
                temp[val].push(obj);
            }
            return false;
        });
        return temp;
    }
};