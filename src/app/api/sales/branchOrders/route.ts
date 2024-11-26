import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const year = searchParams.get("year");

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
            o.branch_code,
            COUNT(DISTINCT od.order_id) AS orders_count,
            DATE_FORMAT(od.date, '%Y-%m') AS orders_date
        FROM order_details AS od
        JOIN orders AS o ON o.id = od.order_id
        JOIN branches AS b ON o.branch_code = b.id
        WHERE od.status = "paid"
          AND YEAR(od.date) = ?
          AND MONTH(od.date) = ?
        GROUP BY b.name, o.branch_code, orders_date
        ORDER BY b.id;`,
        [year, month]
      );
    } else if (year) {
      // Handle yearly data query
      data = await query(
        `SELECT
            b.name AS branch_name,
            o.branch_code,
            COUNT(DISTINCT od.order_id) AS orders_count,
            YEAR(od.date) AS orders_year
        FROM order_details AS od
        JOIN orders AS o ON o.id = od.order_id
        JOIN branches AS b ON o.branch_code = b.id
        WHERE od.status = "paid"
          AND YEAR(od.date) = ?
        GROUP BY b.name, o.branch_code, orders_year
        ORDER BY b.id;`,
        [year]
      );
    }

    // Map the result data to match the expected structure
    const branchesOrders = data.map((row: any) => ({
      branch_name: row.branch_name,
      branch_code: row.branch_code,
      orders_count: row.orders_count,
      orders_date: row.orders_date || row.orders_year,
    }));

    return NextResponse.json({ branchesOrders }, { status: 200 });
  } catch (error: any) {
    console.error(
      "An error occurred while fetching branch orders data:",
      error
    );
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
