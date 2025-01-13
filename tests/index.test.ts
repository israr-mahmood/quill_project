import getDateFiltersFromSQLQuery from '../src';
import {TestDataType} from '../src/constants/testDataType';

const testData: TestDataType[] = [
    {
        testCase: 'TestCase 1: Redshift - Current period',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE EXTRACT(MONTH FROM transaction_date) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE);
        `,
        database: 'redshift',
        output: [
            {
                type: 'current',
                numberOfPeriods: 1,
                period: 'months',
                field: 'transaction_date',
            },
            {
                type: 'current',
                numberOfPeriods: 1,
                period: 'years',
                field: 'transaction_date',
            }
        ],
    },
    // {
    //     testCase: 'TestCase 2: Redshift - Current period',
    //     sqlQuery: `
    //         SELECT *
    //         FROM transactions
    //         WHERE transaction_date >= DATE_TRUNC('month', CURRENT_DATE)
    //           AND transaction_date < (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')
    //     `,
    //     database: 'redshift',
    //     output: [],
    // },
    { // These are last n examples
        testCase: 'TestCase 3: Redshift - Last period',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= DATEADD(day, -90, GETDATE());
        `,
        database: 'redshift',
        output: [
            {
                type: 'last',
                period: 'days',
                numberOfPeriods: -90,
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 4: Redshift - Last period',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= DATEADD(day, -90, CURRENT_DATE);
        `,
        database: 'redshift',
        output: [
            {
                type: 'last',
                period: 'days',
                numberOfPeriods: -90,
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 5: Redshift - Last N periods',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= DATEADD(day, -90, GETDATE());
        `,
        database: 'redshift',
        output: [{
            type: 'last',
            period: 'days',
            numberOfPeriods: -90,
            field: 'transaction_date',
        }],
    },
    {
        testCase: 'TestCase 6: Redshift - Last N periods',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= DATEADD(day, -90, CURRENT_DATE);
        `,
        database: 'redshift',
        output: [{
            type: 'last',
            period: 'days',
            numberOfPeriods: -90,
            field: 'transaction_date',
        }],
    },
    // {
    //     testCase: 'TestCase 7: Redshift - Previous period',
    //     sqlQuery: `
    //         SELECT *
    //         FROM transactions
    //         WHERE transaction_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
    //           AND transaction_date < DATE_TRUNC('month', CURRENT_DATE);
    //     `,
    //     database: 'redshift',
    //     output: [],
    // },
    {
        testCase: 'TestCase 8: Snowflake - Current period',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE YEAR(transaction_date) = YEAR(CURRENT_DATE())
              AND MONTH(transaction_date) = MONTH(CURRENT_DATE());
        `,
        database: 'snowflake',
        output: [
            {
                type: 'current',
                numberOfPeriods: 1,
                period: 'years',
                field: 'transaction_date',
            },
            {
                type: 'current',
                numberOfPeriods: 1,
                period: 'months',
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 9: Snowflake - Current period',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE EXTRACT(YEAR FROM transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE())
        `,
        database: 'snowflake',
        output: [
            {
                type: 'current',
                numberOfPeriods: 1,
                period: 'years',
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 10: Snowflake - Current period',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE YEAR(transaction_date) = YEAR(CURRENT_DATE())
              AND MONTH(transaction_date) = MONTH(CURRENT_DATE());
        `,
        database: 'snowflake',
        output: [
            {
                type: 'current',
                numberOfPeriods: 1,
                period: 'years',
                field: 'transaction_date',
            },
            {
                type: 'current',
                numberOfPeriods: 1,
                period: 'months',
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 11: Snowflake - Current period',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE EXTRACT(YEAR FROM transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE())
              AND EXTRACT(MONTH FROM transaction_date) = EXTRACT(MONTH FROM CURRENT_DATE());
        `,
        database: 'snowflake',
        output: [
            {
                type: 'current',
                numberOfPeriods: 1,
                period: 'years',
                field: 'transaction_date',
            },
            {
                type: 'current',
                numberOfPeriods: 1,
                period: 'months',
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 12: Snowflake - Last period',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= CURRENT_DATE() - INTERVAL '1 YEAR'
        `,
        database: 'snowflake',
        output: [
            {
                type: 'last',
                numberOfPeriods: 1,
                period: 'years',
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 13: Snowflake - Last period',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= DATEADD(YEAR, -1, CURRENT_DATE())
        `,
        database: 'snowflake',
        output: [
            {
                type: 'last',
                numberOfPeriods: -1,
                period: 'years',
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 14: Snowflake - Last N periods',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= CURRENT_DATE() - INTERVAL '90 DAY';
        `,
        database: 'snowflake',
        output: [
            {
                type: 'last',
                numberOfPeriods: 90,
                period: 'days',
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 15: Snowflake - Last N periods',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= CURRENT_DATE() - INTERVAL '6 MONTH'
        `,
        database: 'snowflake',
        output: [
            {
                type: 'last',
                numberOfPeriods: 6,
                period: 'months',
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 16: Snowflake - Last N periods',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= DATEADD(DAY, -90, CURRENT_DATE());
        `,
        database: 'snowflake',
        output: [
            {
                type: 'last',
                numberOfPeriods: -90,
                period: 'days',
                field: 'transaction_date',
            }
        ],
    },
    // {
    //     testCase: 'TestCase 17: Snowflake - Previous period',
    //     sqlQuery: `
    //         SELECT *
    //         FROM transactions
    //         WHERE transaction_date >= DATE_TRUNC('MONTH', CURRENT_DATE() - INTERVAL '1 MONTH')
    //           AND transaction_date < DATE_TRUNC('MONTH', CURRENT_DATE());
    //     `,
    //     database: 'snowflake',
    //     output: [],
    // },
    // {
    //     testCase: 'TestCase 18: Snowflake - Previous period',
    //     sqlQuery: `
    //         SELECT *
    //         FROM transactions
    //         WHERE transaction_date >= DATEADD(month, -1, DATE_TRUNC('MONTH', CURRENT_DATE()))
    //           AND transaction_date < DATE_TRUNC('MONTH', CURRENT_DATE());
    //     `,
    //     database: 'snowflake',
    //     output: [],
    // },
    // {
    //     testCase: 'TestCase 19: Snowflake - Previous period',
    //     sqlQuery: `
    //         SELECT *
    //         FROM transactions
    //         WHERE transaction_date BETWEEN DATE_TRUNC('MONTH', CURRENT_DATE() - INTERVAL '1 MONTH')
    //                   AND LAST_DAY(DATE_TRUNC('MONTH', CURRENT_DATE() - INTERVAL '1 MONTH'));
    //     `,
    //     database: 'snowflake',
    //     output: [],
    // },
    {
        testCase: 'TestCase 20: BigQuery - Current period',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE EXTRACT(YEAR FROM transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE())
              AND EXTRACT(MONTH FROM transaction_date) = EXTRACT(MONTH FROM CURRENT_DATE())
        `,
        database: 'bigquery',
        output: [
            {
                type: 'current',
                numberOfPeriods: 1,
                period: 'years',
                field: 'transaction_date',
            },
            {
                type: 'current',
                numberOfPeriods: 1,
                period: 'months',
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 21: BigQuery - Last period',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)
        `,
        database: 'bigquery',
        output: [
            {
                type: 'last',
                numberOfPeriods: 1,
                period: 'months',
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 22: BigQuery - Last N periods',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
        `,
        database: 'bigquery',
        output: [
            {
                type: 'last',
                numberOfPeriods: 90,
                period: 'days',
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 23: BigQuery - Last N periods',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR)
        `,
        database: 'bigquery',
        output: [
            {
                type: 'last',
                numberOfPeriods: 1,
                period: 'years',
                field: 'transaction_date',
            }
        ],
    },
    // {
    //     testCase: 'TestCase 24: BigQuery - Previous period',
    //     sqlQuery: `
    //         SELECT *
    //         FROM transactions
    //         WHERE PARSE_TIMESTAMP(\"%Y-%M-%D\", transaction_date) = PARSE_TIMESTAMP(\"%Y-%M-%D\", CURRENT_DATE())
    //     `,
    //     database: 'bigquery',
    //     output: [],
    // },
    // {
    //     testCase: 'TestCase 25: BigQuery - Previous period',
    //     sqlQuery: `
    //         SELECT * FROM transactions WHERE TIMESTAMP_TRUNC(dateField, INTERVAL MONTH) = TIMESTAMP_TRUNC(TIMESTAMP_SUB(CURRENT_TIMESTAMP, INTERVAL 30 DAY), MONTH)
    //     `,
    //     database: 'bigquery',
    //     output: [],
    // },
    {
        testCase: 'TestCase 26: MySQL - Current period',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE YEAR(transaction_date) = YEAR(CURRENT_DATE())
              AND MONTH(transaction_date) = MONTH(CURRENT_DATE());
        `,
        database: 'mysql',
        output: [
            {
                type: 'current',
                numberOfPeriods: 1,
                period: 'years',
                field: 'transaction_date',
            },
            {
                type: 'current',
                numberOfPeriods: 1,
                period: 'months',
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 27: MySQL - Current period',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE YEAR(transaction_date) = YEAR(CURDATE());
        `,
        database: 'mysql',
        output: [
            {
                type: 'current',
                numberOfPeriods: 1,
                period: 'years',
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 28: MySQL - Last period',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= CURDATE() - INTERVAL 1 MONTH;
        `,
        database: 'mysql',
        output: [
            {
                type: 'last',
                numberOfPeriods: 1,
                period: 'months',
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 29: MySQL - Last period',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
        `,
        database: 'mysql',
        output: [
            {
                type: 'last',
                numberOfPeriods: 1,
                period: 'months',
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 30: MySQL - Last period',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH);
        `,
        database: 'mysql',
        output: [
            {
                type: 'last',
                numberOfPeriods: 1,
                period: 'months',
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 31: MySQL - Last N periods',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY);
        `,
        database: 'mysql',
        output: [
            {
                type: 'last',
                numberOfPeriods: 90,
                period: 'days',
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 32: MySQL - Last N periods',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= CURDATE() - INTERVAL 90 DAY;
        `,
        database: 'mysql',
        output: [
            {
                type: 'last',
                numberOfPeriods: 90,
                period: 'days',
                field: 'transaction_date',
            }
        ],
    },
    // {
    //     testCase: 'TestCase 33: Postgres - Current period',
    //     sqlQuery: `
    //         SELECT *
    //         FROM transactions
    //         WHERE
    //             DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE);
    //     `,
    //     database: 'postgresql',
    //     output: [],
    // },
    // {
    //     testCase: 'TestCase 34: Postgres - Current period',
    //     sqlQuery: `
    //         SELECT *
    //         FROM transactions
    //         WHERE DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE);
    //     `,
    //     database: 'postgresql',
    //     output: [],
    // },
    // {
    //     testCase: 'TestCase 35: Postgres - Current period',
    //     sqlQuery: `
    //         SELECT *
    //         FROM transactions
    //         WHERE created_at >= date_trunc('month', CURRENT_DATE)
    //           AND created_at < (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month');
    //     `,
    //     database: 'postgresql',
    //     output: [],
    // },
    {
        testCase: 'TestCase 36: Postgres - Last period',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= CURRENT_DATE - INTERVAL '1 month';
        `,
        database: 'postgresql',
        output: [
            {
                type: 'last',
                numberOfPeriods: 1,
                period: 'months',
                field: 'transaction_date',
            }
        ],
    },
    {
        testCase: 'TestCase 37: Postgres - Last N periods',
        sqlQuery: `
            SELECT *
            FROM transactions
            WHERE transaction_date >= CURRENT_DATE - INTERVAL '30 months';
        `,
        database: 'postgresql',
        output: [
            {
                type: 'last',
                numberOfPeriods: 30,
                period: 'months',
                field: 'transaction_date',
            }
        ],
    },
    // {
    //     testCase: 'TestCase 38: Postgres - Previous period',
    //     sqlQuery: `
    //         SELECT *
    //         FROM transactions
    //         WHERE DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month');
    //     `,
    //     database: 'postgresql',
    //     output: [],
    // },
    // {
    //     testCase: 'TestCase 39: Postgres - Previous period',
    //     sqlQuery: `
    //         SELECT *
    //         FROM transactions
    //         WHERE DATE_TRUNC('quarter', transaction_date) = DATE_TRUNC('quarter', CURRENT_DATE - INTERVAL '1 quarter');
    //     `,
    //     database: 'postgresql',
    //     output: [],
    // },
    // {
    //     testCase: 'TestCase 40: Postgres - Previous period',
    //     sqlQuery: `
    //         SELECT *
    //         FROM transactions
    //         WHERE EXTRACT(MONTH FROM transaction_date) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')
    //           AND EXTRACT(YEAR FROM transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month');
    //     `,
    //     database: 'postgresql',
    //     output: [],
    // }
];

describe('getDateFilters', () => {
    testData.forEach(({testCase, sqlQuery, database, output}) => {
        test(`${testCase}`, async () => {
            const actualOutput = getDateFiltersFromSQLQuery({sqlQuery, database});
            expect(actualOutput).toEqual(output);
        })
    })
})