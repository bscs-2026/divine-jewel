import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET() {
    try {
        console.log('Fetching roles from database...');
        const rows = await query(`
            SELECT roles.*
            FROM roles
        `);
        console.log('Fetched roles:', rows);
        return NextResponse.json({ roles: rows }, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while fetching roles:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const { name, description } = await request.json();
    try {
        console.log('Adding role to database...');
        const result = await query(
            'INSERT INTO `roles` (name, description) VALUES (?, ?)',
            [name, description]
        );
        console.log('Added role:', result);
        return NextResponse.json({ message: 'Role added successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('An error occurred while adding role:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}