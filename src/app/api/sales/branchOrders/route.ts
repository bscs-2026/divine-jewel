import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date"); // For monthly requests
    const year = searchParams.get("year"); // For yearly requests

    // Validate query parameters
    if (!date && !year) {
      return NextResponse.json(
        { error: "Either 'date' or 'year' query parameter is required." },
        { status: 400 }
      );
    }

    let data;

    if (date) {
      // Handle monthly data query
      const [year, month] = date.split("-");
      data = await query(
        `SELECT 
          b.name AS branch_name, 
          b.id AS branch_code, 
          COUNT(o.id) AS orders_count,
          DATE_FORMAT(o.date, '%Y-%m') AS orders_date
        FROM rms_db.branches b
        LEFT JOIN rms_db.orders o 
          ON b.id = o.branch_code 
          AND YEAR(o.date) = ?
          AND MONTH(o.date) = ?
        GROUP BY b.id, b.name
        HAVING orders_count > 0
        ORDER BY b.id;`,
        [year, month]
      );
    } else if (year) {
      // Handle yearly data query
      data = await query(
        `SELECT 
          b.name AS branch_name, 
          b.id AS branch_code, 
          COUNT(o.id) AS orders_count,
          YEAR(o.date) AS orders_year
        FROM rms_db.branches b
        LEFT JOIN rms_db.orders o 
          ON b.id = o.branch_code 
          AND YEAR(o.date) = ?
        GROUP BY b.id, b.name
        HAVING orders_count > 0
        ORDER BY b.id;`,
        [year]
      );
    }

    // Map the result data to match the expected structure
    const branchesOrders = data.map((row: any) => ({
      branch_name: row.branch_name,
      branch_code: row.branch_code,
      orders_count: row.orders_count,
      orders_date: row.orders_date || null, // Use orders_year for yearly requests if needed
    }));

    return NextResponse.json({ branchesOrders }, { status: 200 });
  } catch (error: any) {
    console.error("An error occurred while fetching branch orders data:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
