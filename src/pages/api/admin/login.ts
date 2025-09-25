import type { NextApiRequest, NextApiResponse } from 'next';
import { setAdminAuthCookie, clearAdminAuthCookie } from '@/lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { password, action } = req.body || {};

  if (action === 'logout') {
    clearAdminAuthCookie(res);
    return res.status(200).json({ message: 'Logged out' });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(500).json({ message: 'Server misconfigured: ADMIN_PASSWORD missing' });
  }

  if (password === adminPassword) {
    setAdminAuthCookie(res);
    return res.status(200).json({ message: 'Authenticated' });
  }

  return res.status(401).json({ message: 'Invalid password' });
}


