import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const getList = `
            SELECT DISTINCT 
                p.id AS product_id, 
                p.name, 
                p.SKU, 
                p.size, 
                p.color, 
                p.price, 
                s.quantity AS stock,
                b.id AS branch_code,
                b.name AS branch_name,
                b.address_line AS branch_address,
                c.id AS category_id,
                c.name AS category_name
            FROM products p
            JOIN stocks s ON p.id = s.product_id
            JOIN branches b ON s.branch_code = b.id
            JOIN category c ON p.category_id = c.id
            WHERE p.is_archive = 0;
        `;

        const products = await query(getList);

        return NextResponse.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Failed to fetch products list for transaction/order data:', error);

        return NextResponse.json({
            success: false,
            message: 'Failed to fetch products list for transaction/order data.'
        }, { status: 500 });
    }
}

