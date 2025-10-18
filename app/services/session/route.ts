import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { firebaseAdmin } from "@/app/firebase/admin";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const { token } = await req.json();
    if (!token)
      return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const decoded = await firebaseAdmin.auth().verifyIdToken(token);

    cookieStore.set("firebase-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1h
    });

    return NextResponse.json({
      ok: true,
      user: {
        uid: decoded.uid,
        email: decoded.email ?? null,
        displayName: decoded.name ?? null,
        photoURL: decoded.picture ?? null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set("firebase-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return NextResponse.json({ ok: true });
}
