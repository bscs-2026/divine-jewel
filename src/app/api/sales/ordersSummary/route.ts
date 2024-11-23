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
//         FROM rms_db.orders o
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
          COUNT(o.id) AS orders_count
        FROM rms_db.orders o
        WHERE YEAR(o.date) = ?
        GROUP BY order_date
        ORDER BY order_date;
        `,
        [year]
      );
    } else {
      // Fetch data for all years
      data = await query(
        `
        SELECT 
          YEAR(o.date) AS order_date, 
          COUNT(o.id) AS orders_count
        FROM rms_db.orders o
        GROUP BY order_date
        ORDER BY order_date;
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
