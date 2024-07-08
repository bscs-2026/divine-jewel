// src/app/api/categories/id/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { name, description } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        console.log('Updating category in database...');

        const result = await query(
            'UPDATE `category` SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );
        
        console.log('Updated category:', result);

        return NextResponse.json({ message: 'Category updated successfully' }, { status: 200 });

    } catch (error: any){
        console.error('An error occurred while updating category:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
