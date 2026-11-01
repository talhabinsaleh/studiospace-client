import { SignJWT } from "jose";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const COOKIE = "studiospace_token";
const MAX_AGE = 60 * 60 * 24 * 7;

// Turns a valid BetterAuth session into the JWT that the Express server checks
export async function POST() {
  const store = await cookies();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    store.delete(COOKIE);
    return NextResponse.json({ message: "Unauthorized: please log in first." }, { status: 401 });
  }

  const token = await new SignJWT({
    email: session.user.email,
    name: session.user.name,
    picture: session.user.image ?? undefined,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("studiospace")
    .setSubject(session.user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  (await cookies()).delete(COOKIE);
  return NextResponse.json({ ok: true });
}
