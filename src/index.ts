import {AST, Binary, Interval, Parser} from 'node-sql-parser';
import {Period} from './constants/period';
import {DateFilter} from './constants/dateFilter';
import {
    getDateAddAttributes, getDateSubAttributes, getIntervalAttributes,
    getTableColumnName, isActBinaryExpressionType, isActExprListType,
    isActFunctionType, isActIntervalType,
    isDateAddFunction, isDateSubFunction
} from './helpers/queryFunctionIdentifiers';

function extractFromCurrentDate(where: Binary) {
    return where.right.type === 'extract'
        && Object(where.right)?.args.source.name.name[0].value.includes('CURRENT');
}

function monthFromCurrentDate(where: Binary) {
    return isActFunctionType(where.right) && where.right.name.name[0].value.toUpperCase().includes('MONTH');
}

function yearFromCurrentDate(where: Binary) {
    return isActFunctionType(where.right) && where.right.name.name[0].value.toUpperCase().includes('YEAR');
}

function isCurrentDateFilter(where: Binary): boolean {
    return where.operator === '='
        && (extractFromCurrentDate(where)
            || monthFromCurrentDate(where)
            || yearFromCurrentDate(where)
        );
}

function isAddOrSubIntervalFromDate(where: Binary) {
    return isActBinaryExpressionType(where) && isActIntervalType(where.right);
}

function isLastPeriod(where: Binary): boolean {
    return isDateAddFunction(where.right)
        || (isActBinaryExpressionType(where.right) && isAddOrSubIntervalFromDate(where.right))
        || isDateSubFunction(where.right);
}

function isPreviousPeriod(where: Binary): boolean {
    return where.right.type === 'extract';
}

function getCurrentDateFilter(where: Binary): DateFilter {
    let period: Period = 'weeks';
    let field = 'date';

    if (extractFromCurrentDate(where)) {
        period = <Period>`${Object(where.left)?.args.field.toLowerCase()}s`;
        if (Object(where.left)?.args.source.type === 'column_ref') {
            field = getTableColumnName(Object(where.left)?.args.source);
        }
    } else if (isActFunctionType(where.right) && (yearFromCurrentDate(where) || monthFromCurrentDate(where))) {
        period = <Period>`${where.right.name.name[0].value.toLowerCase()}s`;
        field = isActFunctionType(where.left)
            ? Object(where.left.args?.value.find(x => x.type === 'column_ref')).column
            : 'field';
    }

    return {
        type: 'current',
        numberOfPeriods: 1,
        period,
        field,
    }
}

function getLastDateFilter(where: Binary): DateFilter {
    if (isActFunctionType(where.right) && isDateAddFunction(where.right) && isActExprListType(where.right.args)) {
        const {period, numberOfPeriods} = getDateAddAttributes(where.right.args);
        let field = getTableColumnName(where.left);

        return {
            type: 'last',
            period,
            numberOfPeriods,
            field,
        }
    } else if (isActBinaryExpressionType(where.right) && isAddOrSubIntervalFromDate(where.right)) {
        const {period, numberOfPeriods} = getIntervalAttributes(<Interval>where.right.right);
        let field = getTableColumnName(where.left);

        return {
            type: 'last',
            period,
            numberOfPeriods,
            field,
        }
    } else if (isActFunctionType(where.right) && isDateSubFunction(where.right)) {
        const {period, numberOfPeriods} = getDateSubAttributes(where.right);
        let field = getTableColumnName(where.left);

        return {
            type: 'last',
            period,
            numberOfPeriods,
            field,
        }
    }

    return {
        type: 'last',
        numberOfPeriods: 1,
        period: 'months',
        field: 'date',
    };
}

function getPreviousDateFilter(where: Binary): DateFilter {
    return {
        type: 'previous',
        numberOfPeriods: 1,
        period: 'months',
        field: 'date',
    };
}

function extractDateFiltersFromWhere(dateFilters: DateFilter[], where: Binary): void {
    if (where.type === 'binary_expr'
        && (where.left.type !== 'binary_expr' || where.right.type !== 'binary_expr')
    ) {
        if (isCurrentDateFilter(where)) {
            dateFilters.push(getCurrentDateFilter(where));
        } else if (isLastPeriod(where)) {
            dateFilters.push(getLastDateFilter(where));
        } else if (isPreviousPeriod(where)) {
            dateFilters.push(getPreviousDateFilter(where));
        }

    } else {
        if (where.left) {
            extractDateFiltersFromWhere(dateFilters, <Binary>where.left);
        }
        if (where.right) {
            extractDateFiltersFromWhere(dateFilters, <Binary>where.right);
        }
    }
}

export default function getDateFiltersFromSQLQuery({sqlQuery, database}: {
    sqlQuery: string;
    database: 'postgresql' | 'mysql' | 'snowflake' | 'redshift' | 'bigquery'
}): DateFilter[] {
    const parser = new Parser()
    const ast = parser.astify(sqlQuery, { database });
    const dateFilters: DateFilter[] = [];

    (Array.isArray(ast) ? ast : [ast]).map((a: AST) => {
        if (a.type === 'select' && a.where) {
            extractDateFiltersFromWhere(dateFilters, <Binary>a.where)
        }
    });

    return dateFilters;
}
