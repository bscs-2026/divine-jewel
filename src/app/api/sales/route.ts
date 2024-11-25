import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  const [year, month] = date.split("-");

  try {
    const data = await query(
      `SELECT 
    DATE_FORMAT(o.date, '%Y-%m-%d') AS order_date,
    COUNT(DISTINCT o.id) AS order_count
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
    AND MONTH(o.date) = ? 
    AND (order_summary.total_paid - order_summary.total_returned) > 0 
GROUP BY 
    order_date
ORDER BY 
    order_date;
`,
      [year, month]
    );
    return NextResponse.json({ Orders: data }, { status: 200 });
  } catch (error: any) {
    console.error("An error occurred while fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}