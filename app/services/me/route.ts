import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const cookieStore = await cookies();

export async function GET() {
  try {
    const token = cookieStore.get("firebase-token")?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 200 });

    const decoded = await getAuth().verifyIdToken(token);

    return NextResponse.json({
      user: {
        uid: decoded.uid,
        email: decoded.email ?? null,
        displayName: decoded.name ?? null,
        photoURL: decoded.picture ?? null,
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}