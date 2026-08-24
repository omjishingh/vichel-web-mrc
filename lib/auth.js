import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "vichel_token";

function secret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET || "dev-only-change-me");
}

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, secret());
  return payload;
}

export async function setSession(user) {
  const token = await signToken({
    id: user.id,
    role: user.role,
    name: user.name,
  });
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export function publicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    mobile: row.mobile,
    username: row.email || row.mobile,
    role: row.role,
    status: row.status,
    created_at: row.created_at,
  };
}

export async function getAuthFromReq(req) {
  const header = req.headers.get("authorization") || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (bearer) {
    try {
      return await verifyToken(bearer);
    } catch {
      return null;
    }
  }
  return getSession();
}

export async function requireAdminApi(req) {
  const session = await getAuthFromReq(req);
  if (!session || session.role !== "admin") return null;
  return session;
}
