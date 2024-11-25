import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        // Fetch the total count of unique paid orders
        const sqlQuery = `
            SELECT COUNT(DISTINCT order_id) AS total_orders
            FROM order_details
            WHERE status = "paid";
        `;

        const result = await query(sqlQuery);

        // Safely extract the total orders value
        const totalOrders = result[0]?.total_orders || 0;

        // console.log('Total orders:', totalOrders);

        // Return the total orders as JSON
        return NextResponse.json({ totalOrders }, { status: 200 });
    } catch (error) {
        console.error('An error occurred while fetching the total orders:', error);

        // Return error response
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
