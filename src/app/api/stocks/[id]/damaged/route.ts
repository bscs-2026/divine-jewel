// src/app/api/stocks/[id]/damaged/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { branch_code, quantity, employee, batch_id, note} = await request.json();

        if (!id || !branch_code || !quantity) {
            return NextResponse.json({ error: 'Product ID, Branch Code, and Quantity are required' }, { status: 400 });
        }


        console.log('Updating stocks in the database...');
        const result = await query(
            'UPDATE `stocks` SET damaged = damaged + ? WHERE product_id = ? AND branch_code = ?',
            [quantity, id, branch_code]
        );

        console.log('Adding record to stock_details:', result);
        
        await query(
            'INSERT INTO `stock_details` (batch_id, action, product_id, destination_branch, quantity, employee_id, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [batch_id, 'Mark as Damaged', id, branch_code, quantity, employee || 20, note || null]
        );

        return NextResponse.json({ message: 'Stocks updated successfully' }, { status: 200 });

    } catch (error: any) {
        console.error('An error occurred while updating stocks:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
