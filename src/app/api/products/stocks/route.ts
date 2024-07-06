import { NextRequest, NextResponse } from "next/server";
import { query } from '../../../../lib/db';

export async function GET() {
    try {
        console.log('Fetching stock from database...');
        const rows = await query('SELECT * FROM stocks');
        console.log('Fetched stock:', rows);
        return NextResponse.json({ stock: rows }, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while fetching stock:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) { 
    const { inventory_id, status, date, quantity } = await request.json();
    try {
        console.log('Adding stock to database...');
        const result = await query(
            'INSERT INTO `stocks` (inventory_id, status, date, quantity) VALUES (?, ?, ?, ?)',
            [inventory_id, status, date, quantity]
        );
        console.log('Added stocks:', result);
        return NextResponse.json({ message: 'Stock added successfully' }, { status: 201 });
    } catch (error: any) { 
        console.error('An error occurred while adding stock:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}