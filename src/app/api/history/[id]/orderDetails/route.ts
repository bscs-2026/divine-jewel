// src/app/api/orders/[id]/details/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    // Await access to params to ensure they are fully available
    const { id } = await context.params; // 'id' is the order_id

    if (!id) {
      return NextResponse.json({ error: 'order_id is required' }, { status: 400 });
    }

    // console.log('Fetching order details for order_id:', id);

    const rows = await query(`
      SELECT 
        od.status,
        o.id AS order_id,
        o.date AS order_date,
        o.customer_name,
        o.discount_pct AS discount_percent,
        o.applied_credits,
        o.credit_id,
        o.total_amount,
        CONCAT(e.first_name, ' ', e.last_name) AS employee_fullname,
        b.name AS branch_name,
        b.address_line AS branch_address,
        p.id AS product_id,
        p.name AS product_name,
        p.size AS product_size,
        p.color AS product_color,
        od.sku,
        od.quantity,
        od.unit_price,
        (od.quantity * od.unit_price) AS total_unit_price,
        (od.quantity * od.unit_price_deducted) AS total_unit_price_deducted,
        pm.amount_tendered,
        pm.amount_change,
        pm.payment_method AS mop,
        pm.e_wallet_provider,
        pm.reference_number
      FROM 
        orders o
      LEFT JOIN 
        employees e ON o.employee_id = e.id
      LEFT JOIN 
        branches b ON o.branch_code = b.id
      LEFT JOIN 
        order_details od ON o.id = od.order_id
      LEFT JOIN 
        products p ON od.product_id = p.id
      LEFT JOIN 
        payments pm ON o.id = pm.order_id
      WHERE 
        o.id = ? AND od.status = 'Paid';
    `, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // console.log('Fetched order details:', rows);
    return NextResponse.json({ orderDetails: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching order details:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

//curl -X GET 'http://divine-jewel.local:8000/api/history/63/orderDetails/' | jq .