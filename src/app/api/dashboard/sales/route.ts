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
            // Query for daily sales in the specified month and year
            sqlQuery = `
                SELECT 
                    DATE_FORMAT(date, '%Y-%m-%d') AS sales_date,
                    SUM(quantity * unit_price_deducted) AS total_sales
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
            responseKey = 'dailySales';

            // console.log("Fetched Daily Sales Data:", result);
        } else if (year) {
            // Query for monthly sales in the specified year
            sqlQuery = `
                SELECT 
                    DATE_FORMAT(date, '%Y-%m') AS sales_month,
                    SUM(quantity * unit_price_deducted) AS total_sales
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
            responseKey = 'monthlySales';

            // console.log("Executing SQL Query for Monthly Sales:", sqlQuery);
            // console.log("Query Parameters:", queryParams);

            result = await query(sqlQuery, queryParams);
        }

        // Query for yearly sales across all years
        const yearlySalesQuery = `
            SELECT 
                YEAR(date) AS sales_year,
                SUM(quantity * unit_price_deducted) AS total_sales
            FROM 
                order_details
            WHERE 
                status = "paid"
            GROUP BY 
                YEAR(date)
            ORDER BY 
                YEAR(date);
        `;
        const yearlySalesResult = await query(yearlySalesQuery);

        const yearlySales = yearlySalesResult.map((row) => ({
            sales_year: row.sales_year,
            total_sales: row.total_sales ? parseFloat(row.total_sales).toFixed(2) : "0.00",
        }));

        // Prepare the response object
        const response = {
            yearlySales,
        };

        if (result) {
            response[responseKey] = result;
        }

        // Return the result as JSON
        return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while fetching sales data:', error);

        // Return an error response in case of failure
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
