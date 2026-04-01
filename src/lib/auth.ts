import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const ADMIN_PATH = path.join(process.cwd(), "src/data/admin.json");
const COOKIE_NAME = "agile_admin_session";

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET || "agile-forum-secret-change-in-production-2026";
  return new TextEncoder().encode(secret);
}

interface AdminData {
  username: string;
  passwordHash: string;
}

function getAdminData(): AdminData {
  const raw = fs.readFileSync(ADMIN_PATH, "utf-8");
  return JSON.parse(raw);
}

function saveAdminData(data: AdminData): void {
  fs.writeFileSync(ADMIN_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function setupAdmin(username: string, password: string): Promise<boolean> {
  const hash = await bcrypt.hash(password, 12);
  saveAdminData({ username, passwordHash: hash });
  return true;
}

export function isAdminSetup(): boolean {
  const data = getAdminData();
  return data.passwordHash.length > 0;
}

export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const data = getAdminData();
  if (username !== data.username) return false;
  if (!data.passwordHash) return false;
  return bcrypt.compare(password, data.passwordHash);
}

export async function createSession(): Promise<string> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());
  return token;
}

export async function verifySession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
