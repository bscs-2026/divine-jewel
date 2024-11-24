  // src/app/api/products/category/route.ts
  
  import { NextRequest, NextResponse } from 'next/server';
  import { query } from '@/lib/db';

  export async function GET() {
    try {
      // console.log('Fetching categories from database...');
      const rows = await query('SELECT * FROM category');
      return NextResponse.json({ categories: rows }, { status: 200 });
    } catch (error: any) {
      console.error('An error occurred while fetching categories:', error);
      return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
  }

  export async function POST(request: NextRequest) {
    const { name, description } = await request.json();
    try {
      // console.log('Adding category to database...');
      const result = await query(
        'INSERT INTO `category` (name, description) VALUES (?, ?)',
        [name, description]
      );
      return NextResponse.json({ message: 'Category added successfully' }, { status: 201 });
    } catch (error: any) {
      console.error('An error occurred while adding category:', error);
      return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
  }