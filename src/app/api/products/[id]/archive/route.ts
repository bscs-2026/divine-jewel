// src/app/api/products/[id]/archive/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { is_archive } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        if (typeof is_archive !== 'boolean') {
            return NextResponse.json({ error: 'Invalid value for is_archive' }, { status: 400 });
        }

        const result = await query(
            'UPDATE `products` SET is_archive = ? WHERE id = ?',
            [is_archive, id]
        );

        return NextResponse.json({ message: 'Product updated successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while updating product:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
