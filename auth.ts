import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

const SESSION_COOKIE = 'wistech_admin_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h

// In-memory session store: fine for a single shared admin passcode on a
// single Node process. Sessions don't survive a server restart — admins
// just log back in, which is an acceptable trade-off at this scale.
const sessions = new Map<string, number>(); // token -> expiresAt (ms)

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = crypto.createHash('sha256').update(a).digest();
  const bufB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(bufA, bufB);
}

export function checkPassword(passcode: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    console.error('ADMIN_PASSWORD is not set — admin login is disabled until it is configured in .env');
    return false;
  }
  return typeof passcode === 'string' && timingSafeStringEqual(passcode, expected);
}

export function createSession(): string {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, Date.now() + SESSION_TTL_MS);
  return token;
}

export function destroySession(token: string | undefined): void {
  if (token) sessions.delete(token);
}

export function isValidSession(token: string | undefined): boolean {
  if (!token) return false;
  const expiresAt = sessions.get(token);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function getSessionToken(req: Request): string | undefined {
  const header = req.headers.cookie;
  if (!header) return undefined;
  const prefix = `${SESSION_COOKIE}=`;
  const match = header.split(';').map(c => c.trim()).find(c => c.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : undefined;
}

export function setSessionCookie(res: Response, token: string): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_TTL_MS / 1000}${secure}`
  );
}

export function clearSessionCookie(res: Response): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!isValidSession(getSessionToken(req))) {
    res.status(401).json({ error: 'Authentification requise' });
    return;
  }
  next();
}
