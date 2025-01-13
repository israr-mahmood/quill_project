import {DateFilter} from "./dateFilter";

export interface TestDataType {
    testCase: string;
    sqlQuery: string;
    database: 'postgresql' | 'mysql' | 'snowflake' | 'redshift' | 'bigquery';
    output: DateFilter[];
}
