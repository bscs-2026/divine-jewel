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
            order_items, 
            payment_method, 
            tendered_amount, 
            change, 
            e_wallet_provider, 
            reference_number, 
            receipt_image
        } = await request.json();

        // Get a database connection
        connection = await getConnection();

        // Start transaction
        await connection.beginTransaction();

        // Insert the new order into the orders table
        const [orderResult] = await connection.query(
            'INSERT INTO `orders` (date, customer_name, employee_id, branch_code, total_amount) VALUES (?, ?, ?, ?, ?)',
            [date, customer_name, employee_id, branch_code, total_amount]
        );
        const orderId = orderResult.insertId;

        // Insert each item into order_details and update stock quantity
        for (const item of order_items) {
            const { product_id, quantity, unit_price } = item;

            // Check stock availability before updating
            const [stockResult] = await connection.query(
                'SELECT quantity FROM `stocks` WHERE product_id = ? AND branch_code = ?',
                [product_id, branch_code]
            );

            const currentStock = stockResult[0]?.quantity || 0;

            // If the stock is insufficient, throw an error
            if (currentStock < quantity) {
                throw new Error(`Insufficient stock for product_id: ${product_id} in branch_code: ${branch_code}. Available stock: ${currentStock}, Ordered: ${quantity}`);
            }

            // Proceed to update stock if enough quantity is available
            await connection.query(
                'UPDATE `stocks` SET quantity = quantity - ? WHERE product_id = ? AND branch_code = ?',
                [quantity, product_id, branch_code]
            );

            // Insert into order_details
            await connection.query(
                'INSERT INTO `order_details` (order_id, product_id, quantity, unit_price, status) VALUES (?, ?, ?, ?, ?)',
                [orderId, product_id, quantity, unit_price, 'pending'] // Default status is 'pending'
            );
        }

        // Insert payment details into the payments table
        await connection.query(
            `INSERT INTO payments (order_id, payment_date, amount_tendered, amount_change, payment_method, e_wallet_provider, reference_number, receipt_image) 
            VALUES (?, NOW(), ?, ?, ?, ?, ?, ?)`,
            [orderId, tendered_amount || 0, change || 0, payment_method, e_wallet_provider || null, reference_number || null, receipt_image || null]
        );

        // After successful payment, update the order_details status to 'paid'
        await connection.query(
            'UPDATE `order_details` SET status = ? WHERE order_id = ?',
            ['paid', orderId]
        );

        // Commit transaction
        await connection.commit();
        console.log('Order, payment, stock updated, and order_details status set to paid successfully');

        return NextResponse.json({ message: 'Order, details, payment, stock updated, and status paid successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('Error while processing order:', error);

        // Rollback transaction in case of error
        if (connection) await connection.rollback();

        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    } finally {
        // Ensure the connection is released if it was successfully created
        if (connection) await connection.release();
    }
}
