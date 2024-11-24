import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        // console.log('Fetching suppliers from database...');
        const rows = await query('SELECT * FROM `suppliers` WHERE `is_deleted` = 0');
        // console.log('Fetched suppliers:', rows);
        return NextResponse.json({ suppliers: rows }, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while fetching suppliers:', error);
        return NextResponse.json({ error: 'Internal Server Error', data: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const { supplier_name, contact_info, address, email, phone_number } = await request.json();
    
    if (!supplier_name) {
        return NextResponse.json({ error: 'Supplier name is required' }, { status: 400 });
    }

    try {
        // console.log('Adding a new supplier to the database...');
        const result = await query(
            'INSERT INTO `suppliers` (supplier_name, contact_info, address, email, phone_number, is_deleted) VALUES (?, ?, ?, ?, ?, ?)',
            [supplier_name, contact_info || null, address || null, email || null, phone_number || null, 0]
        );        
        // console.log('Added new supplier:', result);
        return NextResponse.json({ message: 'Supplier added successfully'}, { status: 201 });
    } catch (error: any) {
        console.error('An error occurred while adding a supplier:', error);
        return NextResponse.json({ error: 'Internal Server Error', data: error.message }, { status: 500 });
    }
}
