import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        // Execute SQL query to calculate total sales
        const sqlQuery = `
            SELECT 
                SUM(quantity * unit_price_deducted) AS total_sales
            FROM 
                order_details
            WHERE 
                status = 'paid'
                AND DATE IS NOT NULL
        `;

        const result = await query(sqlQuery);

        // Extract the total_sales value from the query result
        const totalSales = result[0]?.total_sales || 0;

        // Return the total sales as JSON
        return NextResponse.json({ totalSales }, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while fetching the total sales data:', error);

        // Return an error response in case of failure
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
