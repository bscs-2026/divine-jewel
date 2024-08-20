import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function PUT(request: NextRequest, { params }: { params: {id: string } } ) {
    try{
        const { id } = params;
        const { branch_code, quantity } = await request.json();


        if (!id || !branch_code) {
            return NextResponse.json({ error: 'Product ID and Branch Code are required' }, { status: 400 });
        }

        console.log('updating stocks in database...');

        const result = await query(
            'UPDATE `stocks` SET quantity = quantity + ? WHERE product_id = ? && branch_code = ?', 
            [quantity, id, branch_code]
        );

        return NextResponse.json({ message: 'stocks updated successfully' }, { status: 200 });

    } catch (error: any){
        console.error('An error occurred while updating stocks:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });

    }

}