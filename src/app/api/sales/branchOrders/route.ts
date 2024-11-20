import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Extract the 'date' parameter from the query string
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date is a required query parameter." },
        { status: 400 }
      );
    }

    // Split the date into year and month
    const [year, month] = date.split("-");

    // Query to fetch branch data for the given year and month
    const data = await query(
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
      [year, month] // Pass year and month as query parameters
    );

    // Map the result data to match the expected structure
    const branchesOrders = data.map((row: any) => ({
      branch_name: row.branch_name,
      branch_code: row.branch_code,
      orders_count: row.orders_count,
      orders_date: row.orders_date,
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
