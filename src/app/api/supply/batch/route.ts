import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        // console.log('Received request to fetch supplies by batch_id');

        const body = await request.json();
        // console.log('Request body:', body);

        const { batch_id } = body;

        if (!batch_id) {
            console.error('Error: batch_id is required in the request body');
            return NextResponse.json({ error: 'batch_id is required' }, { status: 400 });
        }

        console.log('Fetching supplies for batch_id:', batch_id);

        const rows = await query(
            'SELECT sd.*, s.supplier_name AS supplier FROM supply_data sd LEFT JOIN suppliers s ON sd.supplier_id = s.id WHERE sd.batch_id = ?',
            [batch_id]
        );

        console.log('Fetched supplies:', rows);

        if (rows.length === 0) {
            console.warn(`No supplies found for batch_id: ${batch_id}`);
        }

        return NextResponse.json({ supplies: rows }, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while fetching supplies:', error.message);
        return NextResponse.json({ error: 'Internal Server Error', data: error.message }, { status: 500 });
    }
}
