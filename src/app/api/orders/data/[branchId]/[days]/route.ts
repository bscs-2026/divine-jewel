/**
 * API Endpoint:
 *    - GET /api/orders/data/[branchId]/[days]
 *        Retrieves order details for the given branch and the past [days] days.
 *
 * Dynamic Route Parameters:
 *    - [branchId]: The branch ID to filter orders.
 *    - [days]: The number of days to look back. Must be a positive integer.
 *
 * Response:
 *    - 200 OK: Successfully retrieves order data.
 *    - 400 Bad Request: Missing or invalid parameters.
 *    - 500 Internal Server Error: Failed to fetch order data.
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req, context) {
    // Await the params object
    const { branchId, days } = await context.params;

    // Validate branchId and days
    if (!branchId || isNaN(Number(branchId))) {
        return NextResponse.json(
            {
                success: false,
                message: 'Invalid Branch ID. Must be a number.',
            },
            { status: 400 }
        );
    }

    if (!days || isNaN(Number(days)) || Number(days) <= 0) {
        return NextResponse.json(
            {
                success: false,
                message: 'Invalid days parameter. Must be a positive number.',
            },
            { status: 400 }
        );
    }

    try {
        const getOrderData = `
            SELECT 
                o.id AS order_id,
                o.date AS order_date,
                o.customer_name,
                b.name AS branch_name,
                b.address_line AS branch_address,
                p.id AS product_id,
                p.name AS product_name,
                p.sku AS product_sku,
                p.size AS product_size,
                p.color AS product_color,
                o.discount_pct AS discount_percent,
                o.applied_credits,
                od.quantity,
                od.unit_price,
                od.unit_price_deducted,
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
                od.date >= DATE_SUB(NOW(), INTERVAL ? DAY)
                AND od.date <= NOW()
                AND b.id = ?
                AND od.status = 'paid';
        `;

        const orderData = await query(getOrderData, [Number(days), Number(branchId)]);

        // console.log(`Fetched order details for branch ${branchId} and the past ${days} days:`, orderData);

        return NextResponse.json({
            success: true,
            data: orderData,
        });
    } catch (error) {
        console.error(`Failed to fetch order details for branch ${branchId} and the past ${days} days:`, error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || `Failed to fetch order details for branch ${branchId} and the past ${days} days.`,
            },
            { status: 500 }
        );
    }
}

