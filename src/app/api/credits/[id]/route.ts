// src/app/api/credits/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "../../../../lib/db";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  // Await access to params to ensure they are fully available
  const { id: creditId } = await context.params;

  let connection;

  try {
    connection = await getConnection();

    // Query to retrieve the credit information
    const [creditResult] = await connection.query(
      "SELECT * FROM store_credits WHERE id = ? LIMIT 1",
      [creditId]
    );

    if (creditResult.length === 0) {
      return NextResponse.json(
        { error: "Credit ID not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(creditResult[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching credit:", error);
    return NextResponse.json(
      { error: "Failed to retrieve credit information." },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
