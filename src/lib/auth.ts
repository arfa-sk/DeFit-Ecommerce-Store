import type { NextApiResponse } from 'next';

const COOKIE_NAME = 'defit_admin';
const ONE_DAY_SECONDS = 60 * 60 * 24;

export function setAdminAuthCookie(res: NextApiResponse) {
  const expires = new Date(Date.now() + ONE_DAY_SECONDS * 1000);
  const isProd = process.env.NODE_ENV === 'production';
  const secure = isProd ? '; Secure' : '';
  const cookie = `${COOKIE_NAME}=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=${ONE_DAY_SECONDS}; Expires=${expires.toUTCString()}${secure}`;
  res.setHeader('Set-Cookie', cookie);
}

export function clearAdminAuthCookie(res: NextApiResponse) {
  const expires = new Date(0);
  const isProd = process.env.NODE_ENV === 'production';
  const secure = isProd ? '; Secure' : '';
  const cookie = `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=${expires.toUTCString()}${secure}`;
  res.setHeader('Set-Cookie', cookie);
}

export function isAdminAuthenticated(cookies: Partial<Record<string, string>>) {
  return cookies?.[COOKIE_NAME] === '1';
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;

export function parseCookies(header: string | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  if (!header) return result;
  const parts = header.split(';');
  for (const part of parts) {
    const [key, ...rest] = part.trim().split('=');
    if (!key) continue;
    result[key] = decodeURIComponent(rest.join('='));
  }
  return result;
}


