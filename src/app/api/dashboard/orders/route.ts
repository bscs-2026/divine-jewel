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
            // Query for daily orders in the specified month and year
            sqlQuery = `
                SELECT 
                    DATE_FORMAT(date, '%Y-%m-%d') AS orders_date,
                    COUNT(DISTINCT order_id) AS total_orders
                FROM 
                    order_details
                WHERE 
                    status = "paid"
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
            responseKey = 'dailyOrders';

            // console.log("Fetched Daily Orders Data:", result);
        } else if (year) {
            // Query for monthly orders in the specified year
            sqlQuery = `
                SELECT 
                    DATE_FORMAT(date, '%Y-%m') AS orders_month,
                    COUNT(DISTINCT order_id) AS total_orders
                FROM 
                    order_details
                WHERE 
                    status = "paid"
                AND YEAR(date) = ?
                GROUP BY 
                    YEAR(date), MONTH(date)
                ORDER BY 
                    YEAR(date), MONTH(date);
            `;
            queryParams = [year];
            responseKey = 'monthlyOrders';

            // console.log("Executing SQL Query for Monthly Orders:", sqlQuery);
            // console.log("Query Parameters:", queryParams);

            result = await query(sqlQuery, queryParams);
        }

        // Query for yearly orders across all years
        const yearlyOrdersQuery = `
            SELECT 
                YEAR(date) AS orders_year,
                COUNT(DISTINCT order_id) AS total_orders
            FROM 
                order_details
            WHERE 
                status = "paid"
            GROUP BY 
                YEAR(date)
            ORDER BY 
                YEAR(date);
        `;
        const yearlyOrdersResult = await query(yearlyOrdersQuery);

        const yearlyOrders = yearlyOrdersResult.map((row) => ({
            orders_year: row.orders_year,
            total_orders: row.total_orders ? parseInt(row.total_orders, 10) : 0,
        }));        

        // Prepare the response object
        const response = {
            yearlyOrders,
        };

        if (result) {
            response[responseKey] = result;
        }

        // Return the result as JSON
        return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while fetching orders data:', error);

        // Return an error response in case of failure
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
