import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const branch = searchParams.get('branch');

    try {
        let sqlQuery = `
            SELECT p.name AS product_name, c.name AS category_name, 
                   SUM(od.quantity) AS total_quantity_sold, 
                   SUM(od.quantity * p.price * (1 - IFNULL(o.discount_pct, 0) / 100)) AS total_sales 
            FROM rms_db.order_details od 
            JOIN rms_db.products p ON od.product_id = p.id 
            JOIN rms_db.category c ON p.category_id = c.id 
            LEFT JOIN rms_db.orders o ON od.order_id = o.id 
        `;

        const queryParams: any[] = [];

        if (category && category !== 'allCategories') {
            sqlQuery += `WHERE c.name = ? `;
            queryParams.push(category);
        }

        if (branch && branch !== 'allBranches') {
            sqlQuery += category && category !== 'allCategories' ? `AND o.branch_code = ? ` : `WHERE o.branch_code = ? `;
            queryParams.push(branch);
        }

        sqlQuery += `GROUP BY p.name, c.name ORDER BY total_quantity_sold DESC`;

        const data = await query(sqlQuery, queryParams);

        return NextResponse.json({ TopProducts: data }, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while fetching total orders:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}