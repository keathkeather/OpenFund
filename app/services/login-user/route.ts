import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_KEY =
  process.env.FIREBASE_WEB_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

const cookieStore = await cookies();
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }
    if (!API_KEY) {
      return NextResponse.json({ error: "Missing Firebase API key" }, { status: 500 });
    }

    const resp = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );
    const data = await resp.json();

    if (!resp.ok) {
      const code = data?.error?.message || "LOGIN_FAILED";
      const msg =
        code === "EMAIL_NOT_FOUND" ||
        code === "INVALID_PASSWORD" ||
        code === "INVALID_LOGIN_CREDENTIALS"
          ? "Invalid email or password."
          : "Login failed.";
      return NextResponse.json({ error: msg, code }, { status: 401 });
    }

    const idToken: string = data.idToken;

    cookieStore.set("firebase-token", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1h
    });

    return NextResponse.json({
      user: {
        uid: data.localId,
        email: data.email ?? null,
        displayName: data.displayName ?? null,
        photoURL: data.photoUrl ?? null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}