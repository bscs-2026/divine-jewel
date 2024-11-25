import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
    try {
        // Extract year and month from query parameters
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');
        const month = searchParams.get('month');

        // Convert month to numeric if provided as a name
        const numericMonth = month && isNaN(Number(month))
            ? new Date(`${month} 1, ${year}`).getMonth() + 1
            : Number(month);

        // console.log("Year:", year);
        // console.log("Month:", numericMonth);

        let sqlQuery = '';
        let queryParams: any[] = [];
        let responseKey = '';
        let result;

        if (month) {
            // Query for daily returns in the specified month and year
            sqlQuery = `
                SELECT 
                    DATE_FORMAT(date, '%Y-%m-%d') AS returns_date,
                    COUNT(DISTINCT order_id) AS total_returns
                FROM 
                    order_details
                WHERE 
                    status = "returned"
                AND YEAR(date) = ?
                AND MONTH(date) = ?
                GROUP BY 
                    DATE(date)
                ORDER BY 
                    DATE(date);
            `;
            queryParams = [year, numericMonth];

            // console.log("Executing SQL Query:", sqlQuery);
            // console.log("Query Parameters:", queryParams);

            result = await query(sqlQuery, queryParams);
            responseKey = 'dailyReturns';

            // console.log("Fetched Daily Returns Data:", result);
        } else if (year) {
            // Query for monthly returns in the specified year
            sqlQuery = `
                SELECT 
                    DATE_FORMAT(date, '%Y-%m') AS returns_month,
                    COUNT(DISTINCT order_id) AS total_returns
                FROM 
                    order_details
                WHERE 
                    status = "returned"
                AND YEAR(date) = ?
                GROUP BY 
                    YEAR(date), MONTH(date)
                ORDER BY 
                    YEAR(date), MONTH(date);
            `;
            queryParams = [year];
            responseKey = 'monthlyReturns';

            // console.log("Executing SQL Query for Monthly Returns:", sqlQuery);
            // console.log("Query Parameters:", queryParams);

            result = await query(sqlQuery, queryParams);
        }

        // Query for yearly returns across all years
        const yearlyReturnsQuery = `
            SELECT 
                YEAR(date) AS returns_year,
                COUNT(DISTINCT order_id) AS total_returns
            FROM 
                order_details
            WHERE 
                status = "returned"
            GROUP BY 
                YEAR(date)
            ORDER BY 
                YEAR(date);
        `;
        const yearlyReturnsResult = await query(yearlyReturnsQuery);

        const yearlyReturns = yearlyReturnsResult.map((row) => ({
            returns_year: row.returns_year,
            total_returns: row.total_returns ? parseInt(row.total_returns, 10) : 0,
        }));        

        // Prepare the response object
        const response = {
            yearlyReturns,
        };

        if (result) {
            response[responseKey] = result;
        }

        // Return the result as JSON
        return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while fetching returns data:', error);

        // Return an error response in case of failure
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
