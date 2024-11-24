import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  if (!year) {
    return NextResponse.json(
      { error: "Year parameter is required" },
      { status: 400 }
    );
  }

  try {
    const data = await query(
      `SELECT 
    YEAR(o.date) AS year, 
    COUNT(DISTINCT o.id) AS yearly_orders
FROM 
    orders o
JOIN 
    (
        SELECT 
            od.order_id,
            SUM(CASE WHEN od.status = 'paid' THEN od.quantity ELSE 0 END) AS total_paid,
            SUM(CASE WHEN od.status = 'returned' THEN od.quantity ELSE 0 END) AS total_returned
        FROM 
            order_details od
        GROUP BY 
            od.order_id
    ) order_summary ON o.id = order_summary.order_id
WHERE 
    YEAR(o.date) = ? 
    AND (order_summary.total_paid - order_summary.total_returned) > 0 -- Net positive quantity
GROUP BY 
    YEAR(o.date);
`,
      [year]
    );
    return NextResponse.json({ YearlyOrders: data }, { status: 200 });
  } catch (error: any) {
    console.error("An error occurred while fetching total orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
