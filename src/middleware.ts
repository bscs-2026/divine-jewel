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

  // console.log('Current Path:', pathname);

  const publicRoutes = ['/login'];
  const protectedRoutes = ['/dashboard', '/orders', '/product', '/stocks', '/supplies', '/settings', '/employees', '/history', '/logout'];

  if (publicRoutes.includes(pathname)) {
    console.log('Accessing a public route.');
    return NextResponse.next();
  }

  const tokenCookie = req.cookies.get('sessionToken');
  const token = tokenCookie?.value;

  // console.log('Session Token:', token);

  if (!token || typeof token !== 'string') {
    console.error('Session token is missing or invalid.');
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      console.log('Redirecting to /login due to missing/invalid token.');
      return NextResponse.redirect(`${baseUrl}/login`);
    }
    return NextResponse.next();
  }

  try {
    const decoded = await verifyJwt(token, JWT_SECRET);
    // console.log('Decoded Token:', decoded);

    if (!decoded) {
      console.error('Invalid or expired token.');
      return NextResponse.redirect(`${baseUrl}/login`);
    }

    // If authenticated and trying to access a public page, redirect to /dashboard
    if (publicRoutes.includes(pathname)) {
      console.log('Authenticated user accessing a public route. Redirecting to /dashboard.');
      return NextResponse.redirect(`${baseUrl}/dashboard`);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Session validation failed:', error);
    return NextResponse.redirect(`${baseUrl}/login`);
  }
}
