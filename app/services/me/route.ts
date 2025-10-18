import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";


export async function GET() {
  try {
    const cookieStore = await cookies();
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