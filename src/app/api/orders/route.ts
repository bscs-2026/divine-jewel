import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "../../../lib/db";

export async function POST(request: NextRequest) {
    let connection;

    try {
        const {
            date,
            customer_name,
            employee_id,
            branch_code,
            total_amount,
            discount_percentage,
            discounted_amount,
            order_items,
            payment_method,
            tendered_amount,
            change,
            e_wallet_provider,
            reference_number,
            receipt_image
        } = await request.json();

        connection = await getConnection();

        await connection.beginTransaction();

        const [orderResult] = await connection.query(
            `INSERT INTO orders 
             (date, customer_name, employee_id, branch_code, total_amount, discount_pct, discounted_amount) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                date,
                customer_name,
                employee_id,
                branch_code,
                total_amount,
                discount_percentage || null,
                discounted_amount || null
            ]
        );

        const orderId = orderResult.insertId;

        for (const item of order_items) {
            const { product_id, sku, quantity, unit_price } = item;

            console.log(`Processing SKU: ${sku}`);

            const [stockResult] = await connection.query(
                'SELECT quantity FROM `stocks` WHERE product_id = ? AND branch_code = ?',
                [product_id, branch_code]
            );

            const currentStock = stockResult[0]?.quantity || 0;

            if (currentStock < quantity) {
                throw new Error(
                    `Insufficient stock for product_id: ${product_id} in branch_code: ${branch_code}. Available stock: ${currentStock}, Ordered: ${quantity}`
                );
            }

            await connection.query(
                'UPDATE `stocks` SET quantity = quantity - ? WHERE product_id = ? AND branch_code = ?',
                [quantity, product_id, branch_code]
            );

            await connection.query(
                'INSERT INTO `order_details` (order_id, product_id, sku, quantity, unit_price, status) VALUES (?, ?, ?, ?, ?, ?)',
                [orderId, product_id, sku, quantity, unit_price, 'pending']
            );
        }

        await connection.query(
            `INSERT INTO payments (order_id, payment_date, amount_tendered, amount_change, payment_method, e_wallet_provider, reference_number, receipt_image) 
            VALUES (?, NOW(), ?, ?, ?, ?, ?, ?)`,
            [
                orderId,
                tendered_amount || 0,
                change || 0,
                payment_method,
                e_wallet_provider || null,
                reference_number || null,
                receipt_image || null
            ]
        );

        await connection.query(
            'UPDATE `order_details` SET status = ? WHERE order_id = ?',
            ['paid', orderId]
        );

        await connection.commit();
        console.log('Order, payment, stock updated, and order_details status set to paid successfully');

        return NextResponse.json(
            { message: 'Order, details, payment, stock updated, and status paid successfully' },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error while processing order:', error);

        if (connection) await connection.rollback();

        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    } finally {
        if (connection) await connection.release();
    }
}
