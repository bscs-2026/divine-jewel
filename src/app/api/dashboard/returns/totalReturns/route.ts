import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        // Fetch the total count of unique paid returns
        const sqlQuery = `
            SELECT COUNT(DISTINCT order_id) AS total_returns
            FROM order_details
            WHERE status = "returned";
        `;

        const result = await query(sqlQuery);

        // Safely extract the total returns value
        const totalReturns = result[0]?.total_returns || 0;

        // console.log('Total returns:', totalReturns);

        // Return the total returns as JSON
        return NextResponse.json({ totalReturns }, { status: 200 });
    } catch (error) {
        console.error('An error occurred while fetching the total returns:', error);

        // Return error response
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
