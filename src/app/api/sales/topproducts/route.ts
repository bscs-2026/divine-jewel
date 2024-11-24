import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const branch = searchParams.get("branch");
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
          p.name AS product_name, 
          c.name AS category_name, 
          SUM(od.quantity) AS total_quantity_sold, 
          SUM(od.quantity * p.price) AS total_sales 
        FROM 
          rms_db.order_details od 
        JOIN 
          rms_db.products p ON od.product_id = p.id 
        JOIN 
          rms_db.category c ON p.category_id = c.id 
        LEFT JOIN 
          rms_db.orders o ON od.order_id = o.id 
        WHERE 
          YEAR(o.date) = ? AND MONTH(o.date) = ? 
          ${category && category !== "allCategories" ? "AND c.name = ?" : ""}
          ${branch && branch !== "allBranches" ? "AND o.branch_code = ?" : ""}
          AND od.status = 'paid' 
        GROUP BY 
          p.name, c.name 
        ORDER BY 
          total_quantity_sold DESC`,
        [year, month, ...(category && category !== "allCategories" ? [category] : []), ...(branch && branch !== "allBranches" ? [branch] : [])]
      );
    } else if (year) {
      // Handle yearly data query
      data = await query(
        `SELECT 
          p.name AS product_name, 
          c.name AS category_name, 
          SUM(od.quantity) AS total_quantity_sold, 
          SUM(od.quantity * p.price) AS total_sales 
        FROM 
          rms_db.order_details od 
        JOIN 
          rms_db.products p ON od.product_id = p.id 
        JOIN 
          rms_db.category c ON p.category_id = c.id 
        LEFT JOIN 
          rms_db.orders o ON od.order_id = o.id 
        WHERE 
          YEAR(o.date) = ? 
          ${category && category !== "allCategories" ? "AND c.name = ?" : ""}
          ${branch && branch !== "allBranches" ? "AND o.branch_code = ?" : ""}
          AND od.status = 'paid' 
        GROUP BY 
          p.name, c.name 
        ORDER BY 
          total_quantity_sold DESC`,
        [year, ...(category && category !== "allCategories" ? [category] : []), ...(branch && branch !== "allBranches" ? [branch] : [])]
      );
    }

    return NextResponse.json({ TopProducts: data }, { status: 200 });
  } catch (error: any) {
    console.error("An error occurred while fetching total orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}