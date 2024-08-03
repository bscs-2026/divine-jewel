import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function PUT(request: NextRequest, { params }: { params: {id: string } } ) {
    try{
        const { id } = params;
        const { quantity } = await request.json();

        if (!id) {
            return NextResponse.json({error: 'ID is required'}, { status: 400});
        }

        console.log('updating inventory in database...');

        const result = await query(
            'UPDATE `inventory_item` SET quantity = quantity + ? WHERE product_id = ?', 
            [quantity, id]
        );

        return NextResponse.json({ message: 'Inventory updated successfully' }, { status: 200 });

    } catch (error: any){
        console.error('An error occurred while updating inventory_item:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });

    }

}