// src/app/api/stocks/[id]/stockOut/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { branch_code, quantity, stock_out_reason, employee_id, batch_id, note } = await request.json();

        if (!id || !branch_code || !quantity) {
            return NextResponse.json({ error: 'Product ID, Branch Code, and Quantity are required' }, { status: 400 });
        }

        console.log('Updating stocks in the database...');
        
        let updateQuery = 'UPDATE stocks SET quantity = quantity - ? WHERE product_id = ? AND branch_code = ?';
        let queryParams = [quantity, id, branch_code];

        // Check if the stock out reason is "damaged"
        if (stock_out_reason === 'Damaged') {
            updateQuery = 'UPDATE stocks SET quantity = quantity - ?, damaged = damaged - ? WHERE product_id = ? AND branch_code = ?';
            queryParams = [quantity, quantity, id, branch_code];
        }

        // Execute the update query
        const result = await query(updateQuery, queryParams);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Stock update failed; check product_id and branch_code' }, { status: 400 });
        }

        console.log('Adding record to stock_details:', result);
        
        // Insert the stock out record in stock_details, including the note
        await query(
            'INSERT INTO stock_details (batch_id, action, product_id, source_branch, quantity, employee_id, stock_out_reason, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [batch_id, 'Stock Out', id, branch_code, quantity, employee_id, stock_out_reason, note || null]
        );

        return NextResponse.json({ message: 'Stock out processed successfully' }, { status: 200 });

    } catch (error: any) {
        console.error('An error occurred while processing stock out:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

