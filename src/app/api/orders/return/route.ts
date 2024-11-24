import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request: NextRequest) {
    let connection;

    try {
        // Parse and log the incoming request body
        const body = await request.json();
        // console.log("Received payload:", JSON.stringify(body, null, 2));

        const { orderId, returnItems, employeeId, customerName } = body;

        // Validate the payload
        if (!orderId || !Array.isArray(returnItems) || returnItems.length === 0) {
            console.warn("Validation error: Missing orderId or invalid returnItems array.");
            return NextResponse.json(
                { error: 'Order ID and return items are required, and returnItems must be an array.' },
                { status: 400 }
            );
        }

        // Establish a database connection
        connection = await getConnection();
        // console.log("Database connection established.");

        // Begin a transaction
        await connection.beginTransaction();
        // console.log("Transaction started.");

        let totalCreditAmount = 0;

        // Process each return item
        for (const item of returnItems) {
            const { product_id, quantity, note } = item;

            // console.log("Processing return item:", { product_id, quantity, note });

            // Check if the order detail exists and fetch required fields
            const [orderDetailsResult] = await connection.query(
                `SELECT unit_price, discount_pct, unit_price_deducted, quantity, sku 
                 FROM order_details 
                 WHERE order_id = ? AND product_id = ?`,
                [orderId, product_id]
            );

            // console.log("Order details query result:", orderDetailsResult);

            if (!orderDetailsResult || orderDetailsResult.length === 0) {
                throw new Error(`No order detail found for order ID ${orderId} and Product ID ${product_id}.`);
            }

            const { unit_price, discount_pct, unit_price_deducted, quantity: maxQuantity, sku } = orderDetailsResult[0];

            // Validate return quantity
            if (quantity > maxQuantity) {
                throw new Error(
                    `Return quantity (${quantity}) exceeds available stock (${maxQuantity}) for Product ID ${product_id}.`
                );
            }

            // Calculate credit amount
            const creditAmount = unit_price_deducted * quantity;
            totalCreditAmount += creditAmount;
            // console.log(`Calculated credit amount for Product ID ${product_id}: ${creditAmount}`);

            // Record the returned item in order_details
            await connection.query(
                `INSERT INTO order_details 
                 (order_id, product_id, sku, quantity, unit_price, discount_pct, unit_price_deducted, date, status, note, employee_incharge) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 'returned', ?, ?)`,
                [orderId, product_id, sku, quantity, unit_price, discount_pct, unit_price_deducted, note, employeeId]
            );
            // console.log(`Return recorded for Product ID ${product_id}.`);
        }

        // Add a single store credit for the total credit amount
        const [storeCreditResult] = await connection.query(
            `INSERT INTO store_credits 
             (customer_name, order_id, credit_amount, credit_date, status, credit_type, description) 
             VALUES (?, ?, ?, NOW(), 'active', 'return', ?)`,
            [customerName || null, orderId, totalCreditAmount, `Total credit for returned items`]
        );

        const creditId = storeCreditResult.insertId; // Fetch the inserted credit ID
        // console.log(`Single store credit issued for total amount: ${totalCreditAmount}, Credit ID: ${creditId}`);

        // Commit the transaction
        // console.log("Committing transaction...");
        await connection.commit();
        // console.log("Transaction committed successfully.");

        // Return a success response with the single credit ID
        const response = {
            message: 'Return processed successfully.',
            totalCreditAmount,
            creditId, // Single credit ID
        };
        // console.log("API Response:", response);

        return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
        // Handle errors
        console.error("Error during API processing:", error);

        // Rollback transaction on error
        if (connection) {
            // console.log("Rolling back transaction...");
            await connection.rollback();
        }

        // Return an error response
        return NextResponse.json(
            { error: error.message || 'Failed to process return.' },
            { status: 500 }
        );
    } finally {
        // Release the database connection
        if (connection) {
            // console.log("Releasing database connection...");
            connection.release();
        }
    }
}
