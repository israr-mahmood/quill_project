import {
    Binary,
    ColumnRef,
    ColumnRefExpr,
    ColumnRefItem,
    ExpressionValue,
    ExprList,
    Function, Interval,
    Value
} from 'node-sql-parser';
import {Period} from '../constants/period';

const FUNCTION_NAMES = {
    DATEADD: 'DATEADD',
    DATE_SUB: 'DATE_SUB',
};

export function isActIntervalType(node: object | null): node is Interval {
    return !!node && Object(node)?.type === 'interval';
}

export function isActBinaryExpressionType(node: object | null): node is Binary {
    return !!node && Object(node).type === 'binary_expr';
}

export function isActValueNumberType(node: object | null): node is Value {
    return !!node && Object(node)?.type === 'number';
}

export function isActFunctionType(node: ExpressionValue): node is Function {
    return node.type === 'function';
}

export function isActColumnRefItemType(node: ExpressionValue): node is ColumnRefItem {
    return node.type === 'column_ref';
}

export function isActExprListType(node: object | null | undefined): node is ExprList {
    return !!node && Object(node)?.type === 'expr_list';
}

export function getTableColumnName(node: ExpressionValue): string {
    if (isActColumnRefItemType(node)) {
        return typeof node.column === 'string'
            ? node.column
            : String(node.column.expr.value);
    }

    return '';
}

export function isDateSubFunction(node: ExpressionValue): boolean {
    if (isActFunctionType(node)) {
        if (node.name.name && node.name.name.length > 0) {
            return node.name.name[0].value.toUpperCase() === FUNCTION_NAMES.DATE_SUB;
        } else if (node.name.schema) {
            return node.name.schema.value.toUpperCase() === FUNCTION_NAMES.DATE_SUB;
        }
    }

    return false;
}

export function isDateAddFunction(node: ExpressionValue): boolean {
    if (isActFunctionType(node)) {
        if (node.name.name && node.name.name.length > 0) {
            return node.name.name[0].value.toUpperCase() === FUNCTION_NAMES.DATEADD;
        } else if (node.name.schema) {
            return node.name.schema.value.toUpperCase() === FUNCTION_NAMES.DATEADD;
        }
    }

    return false;
}

export function getDateSubAttributes(node: Function): {period: Period, numberOfPeriods: number} {
    let period: Period = 'days', numberOfPeriods: number = 0;

    if (isActFunctionType(node)
        && isActExprListType(node.args)
        && isActFunctionType(node.args.value[0])
        && (node.args.value[0].name.name[0].value.toUpperCase().includes('DATE')
            || node.args.value[0].name.name[0].value.toUpperCase().includes('NOW'))
        && isActIntervalType(node.args.value[1])
    ) {
        const {
            period: periodInterval,
            numberOfPeriods: numberOfPeriodsInterval
        } = getIntervalAttributes(node.args.value[1]);

        period = periodInterval;
        numberOfPeriods = numberOfPeriodsInterval;
    }

    return {
        period,
        numberOfPeriods
    }
}

export function getIntervalAttributes(node: Interval): {period: Period, numberOfPeriods: number} {
    let period: Period, numberOfPeriods: number;

    if (typeof node.expr.value === 'number') {
        numberOfPeriods = node.expr.value;
        period = <Period>`${node.unit}${node.unit[node.unit.length - 1] === 's' ? '' : 's'}`
    } else {
        const attributes = (<string>node.expr.value).toLowerCase().split(' ');
        period = <Period>`${attributes[1]}${attributes[1][attributes[1].length - 1] === 's' ? '' : 's'}`;
        numberOfPeriods = Number(attributes[0]);

    }

    return {
        numberOfPeriods,
        period,
    }
}

export function getDateAddAttributes(exprList: ExprList): {period: Period, numberOfPeriods: number} {
    let period: Period = 'days', numberOfPeriods: number = 0;

    const columnRef = (<ColumnRefItem | null>exprList.value.find(v => v.type === 'column_ref'));
    const numberOfPeriodObj = (<ColumnRefItem | null>exprList.value.find(v => v.type === 'number'));

    if (columnRef && columnRef.column) {
        period = <Period>`${getTableColumnName(columnRef)}s`.toLowerCase();
    }

    if (numberOfPeriodObj && numberOfPeriodObj.column) {
        numberOfPeriods = typeof numberOfPeriodObj.column === 'string'
            ? Number(numberOfPeriodObj.column)
            : Number(numberOfPeriodObj.column.expr.value);
    } else if (isActValueNumberType(numberOfPeriodObj)) {
        numberOfPeriods = Number(numberOfPeriodObj.value);
    }

    return {
        period,
        numberOfPeriods,
    };
}
