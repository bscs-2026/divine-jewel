// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";

export async function GET() {
    try {
        console.log('Fetching orders from database');
        const rows = await query('SELECT * FROM orders');
        console.log('Fetched orders:', rows);
        return NextResponse.json({ orders: rows}, {status: 200});
    } catch (error: any) {
        console.error('An error occurred while fetching products:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
      }
}

export async function POST(request: NextRequest) {
    const { date, customer_id, employee_id, shop_loc_id, total_amount } = await request.json();
    try {
        console.log('Adding order to database...');
        const result = await query(
            'INSERT INTO `orders` (date, customer_id, employee_id, shop_loc_id, total_amount) VALUES (?, ?, ?, ?, ?)',
            [date, customer_id, employee_id, shop_loc_id, total_amount]
        );
        console.log('Added order:', result);
        return NextResponse.json({ message: 'Order added successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('An error occurred while adding order:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}