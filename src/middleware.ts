// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

async function verifyJwt(token: string, secret: string) {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  const publicRoutes = ['/login', '/error'];
  const roleBasedRoutes: Record<number, string[]> = {
    1: ['*'], // Role 1: Admin - can access all pages
    2: ['*'], // Role 2: Assistant (Admin Assistant?) - can access all pages for now, we will adjust later
    3: ['/orders', '/returns'], // Role 3: Cashier - can access only specific pages
  };

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    console.log('Accessing a public route.');
    return NextResponse.next();
  }

  const tokenCookie = req.cookies.get('sessionToken');
  const token = tokenCookie?.value;

  if (!token || typeof token !== 'string') {
    console.error('Session token is missing or invalid.');
    return NextResponse.redirect(`${baseUrl}/login`);
  }

  try {
    const decoded = await verifyJwt(token, JWT_SECRET);

    if (!decoded) {
      console.error('Invalid or expired token.');
      return NextResponse.redirect(`${baseUrl}/login`);
    }

    const roleId = decoded.role_id;
    if (!roleId || !roleBasedRoutes[roleId]) {
      console.error('Invalid or missing role in token.');
      return NextResponse.redirect(`${baseUrl}/error`);
    }

    // Check if the user's role allows access to the requested route
    const allowedRoutes = roleBasedRoutes[roleId];
    if (!allowedRoutes.includes('*') && !allowedRoutes.includes(pathname)) {
      console.error(`Access denied for role ${roleId} to route: ${pathname}`);
      return NextResponse.redirect(`${baseUrl}/error`);
    }

    // Authenticated and authorized
    return NextResponse.next();
  } catch (error) {
    console.error('Session validation failed:', error);
    return NextResponse.redirect(`${baseUrl}/login`);
  }
}

export const config = {
  matcher: [
    '/dashboard',
    '/orders',
    '/returns',
    '/products',
    '/stocks',
    '/supplies',
    '/settings',
    '/employees',
    '/history',
    '/logout',
  ],
};
