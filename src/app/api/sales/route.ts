import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
        return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const [year, month] = date.split('-');

    try {
        const data = await query(
            `SELECT 
                DATE_FORMAT(date, '%Y-%m-%d') AS order_date,
                COUNT(*) AS order_count
            FROM 
                orders
            WHERE 
                YEAR(date) = ? AND MONTH(date) = ?
            GROUP BY 
                order_date
            ORDER BY 
                order_date`,
            [year, month]
        );
        console.log('Fetched orders:', data);
        return NextResponse.json({ Orders: data }, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while fetching orders:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}