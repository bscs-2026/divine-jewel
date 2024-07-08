import { NextRequest, NextResponse } from "next/server";
import { query } from '../../../../lib/db';

export async function GET() {
    try {
        console.log('Fetching sale from database...');
        const rows = await query('SELECT * FROM sales');
        console.log('Fetched sale:', rows);
        return NextResponse.json({ sales: rows }, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while fetching sale:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) { 
    const { product_id, product_sold, total_sales} = await request.json();
    try {
        console.log('Adding sale to database...');
        const result = await query(
            'INSERT INTO `sales` (product_id, product_sold, total_sales) VALUES (?, ?, ?)',
            [product_id, product_sold, total_sales]
        );
        console.log('Added sales:', result);
        return NextResponse.json({ message: 'Sale added successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('An error occurred while adding sale:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}