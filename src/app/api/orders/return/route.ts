import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "../../../../lib/db";

export async function POST(request: NextRequest) {
  let connection;

  try {
    const { orderId, returnItems, employeeId } = await request.json();

    if (!orderId || !returnItems || returnItems.length === 0) {
      return NextResponse.json(
        { error: "Order ID and return items are required." },
        { status: 400 }
      );
    }

    connection = await getConnection();

    await connection.beginTransaction();

    // Loop through each returned item and update the `order_details` table
    for (const item of returnItems) {
      const { productCode: sku, quantity, reason } = item;

      // Ensure the product exists by validating the SKU
      const [orderDetailsResult] = await connection.query(
        `SELECT * FROM order_details WHERE order_id = ? AND sku = ? LIMIT 1`,
        [orderId, sku]
      );

      if (orderDetailsResult.length === 0) {
        throw new Error(`No order detail found with order ID ${orderId} and SKU ${sku}.`);
      }

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

    }

    await connection.commit();

    return NextResponse.json(
      { message: "Return processed successfully." },
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
