// import { NextResponse } from "next/server";
// import { query } from "@/lib/db";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const year = searchParams.get("year");

//   if (!year) {
//     return NextResponse.json({ error: "Year is required" }, { status: 400 });
//   }

//   try {
//     const data = await query(
//       `SELECT 
//         DATE_FORMAT(o.date, '%Y-%m') AS order_date, 
//         COUNT(o.id) AS orders_count
//         FROM orders o
//         WHERE YEAR(o.date) = ?
//         GROUP BY order_date
//         ORDER BY order_date;
//          `,
//       [year]
//     );
//     return NextResponse.json({ ordersSummary: data }, { status: 200 });
//   } catch (error: any) {
//     console.error("An error occurred while fetching orders summary:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error", details: error.message },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  try {
    let data;

    if (year) {
      // Fetch data for a specific year
      data = await query(
        `
        SELECT 
    DATE_FORMAT(o.date, '%Y-%m') AS order_date, 
    COUNT(DISTINCT o.id) AS orders_count
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
    DATE_FORMAT(o.date, '%Y-%m')
ORDER BY 
    order_date;

        `,
        [year]
      );
    } else {
      // Fetch data for all years
      data = await query(
        `
        SELECT 
    YEAR(o.date) AS order_date, 
    COUNT(DISTINCT o.id) AS orders_count
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
    (order_summary.total_paid - order_summary.total_returned) > 0 -- Net positive quantity
GROUP BY 
    YEAR(o.date)
ORDER BY 
    order_date;

        `
      );
    }

    return NextResponse.json({ ordersSummary: data }, { status: 200 });
  } catch (error: any) {
    console.error("An error occurred while fetching orders summary:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
