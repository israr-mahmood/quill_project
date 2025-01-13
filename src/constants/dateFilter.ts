import {Period} from "./period";

export interface DateFilter {
    type: 'current' | 'last' | 'next' | 'previous';
    numberOfPeriods: number;
    period: Period;
    field: string;
}
