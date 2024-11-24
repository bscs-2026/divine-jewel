// src/app/api/credits/route.ts

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const activeCreditsQuery = `
            SELECT 
                id, 
                customer_name, 
                credit_amount, 
                status
            FROM store_credits
            WHERE status = 'active';
        `;

        // Execute the query
        const credits = await query(activeCreditsQuery);

        // Return successful response with metadata
        return NextResponse.json({
            success: true,
            message: 'Active credits fetched successfully.',
            count: credits.length,
            data: credits,
        });
    } catch (error) {
        console.error('Error fetching active credits:', error.message || error);

        return NextResponse.json({
            success: false,
            message: 'Failed to fetch active credits. Please try again later.',
        }, { status: 500 });
    }
}



