// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('firebase-token')?.value;

  const url = req.nextUrl.clone();

  // Example: Protect any route starting with /dashboard
  if (url.pathname.startsWith('/dashboard')) {
    if (!token) {
      url.pathname = '/sign-in';
      return NextResponse.redirect(url);
    }

    try {
      await getAuth().verifyIdToken(token);
      return NextResponse.next();
    } catch (err) {
      console.error('Invalid token:', err);
      url.pathname = '/sign-in';
      return NextResponse.redirect(url);
    }
  }

  // Allow everything else
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*,'], // Only runs middleware on these routes
};
