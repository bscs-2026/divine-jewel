import { NextRequest, NextResponse } from "next/server";
import { query } from '../../../../lib/db';

export async function GET() {
    try {
        console.log('Fetching stock details from database...');
        const rows = await query('SELECT * FROM stock_details');
        console.log('Fetched stock:', rows);
        return NextResponse.json({ stock_details: rows }, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while fetching stock:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) { 
    const { product_id, date, source_branch, destination_branch, quantity, employee_id, note } = await request.json();
    try {
        console.log('Adding stock details to database...');
        const result = await query(
            'INSERT INTO `stock_details` (product_id, date, source_branch, destination_branch, quantity, employee_id, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [product_id, date, source_branch, destination_branch, quantity, employee_id, note]
        );
        console.log('Added stock_details:', result);
        return NextResponse.json({ message: 'stock details added successfully' }, { status: 201 });
    } catch (error: any) { 
        console.error('An error occurred while adding stock:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}