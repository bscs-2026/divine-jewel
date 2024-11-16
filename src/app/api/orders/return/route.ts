// src/app/api/orders/return/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "../../../../lib/db";

export async function POST(request: NextRequest) {
  let connection;

  try {
    const { orderId, returnItems, employeeId, customerName } = await request.json();

    if (!orderId || !returnItems || returnItems.length === 0) {
      return NextResponse.json(
        { error: "Order ID and return items are required." },
        { status: 400 }
      );
    }

    connection = await getConnection();

    await connection.beginTransaction();

    let totalCreditAmount = 0;

    // Loop through each returned item and update the `order_details` table
    for (const item of returnItems) {
      const { productCode: sku, quantity, reason } = item;

      // Ensure the product exists by validating the SKU and retrieving product_id
      const [orderDetailsResult] = await connection.query(
        `SELECT * FROM order_details WHERE order_id = ? AND sku = ? LIMIT 1`,
        [orderId, sku]
      );

      if (orderDetailsResult.length === 0) {
        throw new Error(`No order detail found with order ID ${orderId} and SKU ${sku}.`);
      }

      const { product_id: productId, unit_price_deducted: unitPriceDeducted } = orderDetailsResult[0];
      const creditAmount = unitPriceDeducted * quantity;
      totalCreditAmount += creditAmount;

      // Update order_details for the return
      await connection.query(
        `
        UPDATE order_details 
        SET 
          return_reason = ?, 
          return_quantity = ?, 
          return_date = NOW(), 
          employee_incharge = ?, 
          status = 'returned'
        WHERE order_id = ? AND sku = ?
        `,
        [reason, quantity, employeeId, orderId, sku]
      );

      // Insert into store_credits table, passing null for customer_name if not provided
      await connection.query(
        `
        INSERT INTO store_credits 
          (customer_name, order_id, credit_amount, credit_date, status, credit_type, description) 
        VALUES 
          (?, ?, ?, NOW(), 'active', 'return', ?)
        `,
        [customerName || null, orderId, creditAmount, `Return for Product ID ${productId}`]
      );

      console.log(`Return credit issued for Product ID: ${productId} with amount: ${creditAmount}`);
    }

    // Commit transaction after processing all items
    await connection.commit();

    return NextResponse.json(
      { 
        message: "Return processed and credits issued successfully.", 
        totalCreditAmount 
      },
      { status: 200 }
    );
  } catch (error) {
    // If an error occurs, rollback the transaction
    if (connection) await connection.rollback();

    console.error("Error processing return:", error);
    return NextResponse.json(
      { error: "Failed to process return." },
      { status: 500 }
    );
  } finally {
    // Release the connection back to the pool
    if (connection) connection.release();
  }
}
