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
    const { product_id, source_branch, destination_branch, quantity, employee_id, note } = await request.json();
    try {
        console.log('Adding stock details to database...');
        const result = await query(
            'INSERT INTO `stock_details` (product_id, source_branch, destination_branch, quantity, employee_id, note) VALUES (?, ?, ?, ?, ?, ?)',
            [product_id, source_branch, destination_branch, quantity, employee_id || null, note || null]
        );
        console.log('Added stock_details:', result);

        // Update the stock quantity for the source branch (subtract the quantity)
        console.log('Updating quantity in source branch...');
        const sourceUpdateResult = await query(
            'UPDATE `stocks` SET quantity = quantity - ? WHERE product_id = ? AND branch_code = ?',
            [quantity, product_id, source_branch]
        );

        // Check if destination branch exists
        const destinationBranchExists = await query(
            'SELECT 1 FROM `stocks` WHERE product_id = ? AND branch_code = ?',
            [product_id, destination_branch]
        );

        if (Array.isArray(destinationBranchExists) && destinationBranchExists.length > 0) {
            // Update the stock quantity for the destination branch (add the quantity)
            console.log('Updating quantity in destination branch...');
            const destinationUpdateResult = await query(
                'UPDATE `stocks` SET quantity = quantity + ? WHERE product_id = ? AND branch_code = ?',
                [quantity, product_id, destination_branch]
            );
        } else {
            // Insert a new record for the destination branch
            console.log('Destination branch does not exist. Inserting new record...');
            const destinationInsertResult = await query(
                'INSERT INTO `stocks` (product_id, branch_code, quantity) VALUES (?, ?, ?)',
                [product_id, destination_branch, quantity]
            );
            console.log('Inserted new stock record:', destinationInsertResult);
        }

        return NextResponse.json({ message: 'Stock details added successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('An error occurred while adding stock:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}