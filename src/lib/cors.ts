// src/lib/cors.ts
import { NextRequest, NextResponse } from 'next/server';

export function handleCors(request: NextRequest) {
  const headers = new Headers();

  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Allow-Origin', '*'); // Adjust this to your specific origin(s)
  headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,DELETE,OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers, status: 204 });
  }

  return headers;
}