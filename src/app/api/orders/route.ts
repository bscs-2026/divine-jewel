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
            subtotal_amount,
            discount_percentage,
            total_amount,
            order_items,
            payment_method,
            tendered_amount,
            change,
            e_wallet_provider,
            reference_number,
            receipt_image,
            applied_credits,
            credit_id
        } = await request.json();

        connection = await getConnection();

        // Begin a transaction
        await connection.beginTransaction();

        // Insert order details
        const [orderResult] = await connection.query(
            `INSERT INTO orders 
             (date, customer_name, employee_id, branch_code, subtotal_amount, discount_pct, applied_credits, credit_id, total_amount) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                date,
                customer_name || null,
                employee_id,
                branch_code,
                subtotal_amount,
                discount_percentage || null,
                applied_credits || null,
                credit_id || null,
                total_amount ?? 0
            ]
        );

        const orderId = orderResult.insertId;
        console.log('Generated order_id:', orderId);

        // Process each order item
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

            // Update stock quantity
            await connection.query(
                'UPDATE `stocks` SET quantity = quantity - ? WHERE product_id = ? AND branch_code = ?',
                [quantity, product_id, branch_code]
            );

            const itemDiscountedPct = discount_percentage || 0;
            const itemFinalPrice = discount_percentage
                ? unit_price - (unit_price * (itemDiscountedPct / 100))
                : unit_price;


            await connection.query(
                'INSERT INTO `order_details` (order_id, product_id, sku, quantity, unit_price, discount_pct, unit_price_deducted, status, employee_incharge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [orderId, product_id, sku, quantity, unit_price, itemDiscountedPct, itemFinalPrice, 'pending', employee_id]
            );
        }

        // Insert payment information
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

        // Process store credits only if credits are being applied
        if (applied_credits > 0 && credit_id) {
            const [creditCheck] = await connection.query(
                'SELECT * FROM store_credits WHERE id = ? AND status = "active"',
                [credit_id]
            );
            console.log("Store credit check:", creditCheck);

            if (creditCheck.length === 0) {
                console.error(`Credit ID ${credit_id} is not active or does not exist.`);
                return NextResponse.json(
                    { error: `Credit ID ${credit_id} is not active or does not exist.` },
                    { status: 400 }
                );
            }

            const remainingCredits = creditCheck[0].credit_amount - Math.abs(subtotal_amount);

            const [creditResult] = await connection.query(
                `
                UPDATE store_credits 
                SET credit_amount = GREATEST(?, 0),
                    status = CASE 
                                WHEN ? <= 0 THEN 'used' 
                                ELSE 'active' 
                             END,
                    order_id = ?
                WHERE id = ? AND status = 'active'
                `,
                [remainingCredits, remainingCredits, orderId, credit_id]
            );

            console.log(`Credits updated for credit_id: ${credit_id}, Remaining credits: ${remainingCredits}`);
            console.log("Affected rows:", creditResult.affectedRows);

            if (creditResult.affectedRows === 0) {
                console.warn(`No rows were updated. Check if credit ID ${credit_id} is active and valid.`);
            }
        }

        await connection.commit();
        console.log('Order, payment, stock updated, and order_details status set to paid successfully');

        return NextResponse.json(
            {
                message: 'Order, details, payment, stock updated, and status paid successfully',
                order_id: orderId
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error while processing order:', error.message, error.stack);

        if (connection) await connection.rollback();

        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    } finally {
        if (connection) await connection.release();
    }
}
