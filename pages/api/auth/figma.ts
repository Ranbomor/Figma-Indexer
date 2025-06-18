// pages/api/auth/figma.ts

import type { NextApiRequest, NextApiResponse } from 'next';

const CLIENT_ID = process.env.FIGMA_CLIENT_ID!;
const CLIENT_SECRET = process.env.FIGMA_CLIENT_SECRET!;
const REDIRECT_URI = process.env.FIGMA_REDIRECT_URI!;
console.log("🚨 DEBUG — Using redirect_uri:", REDIRECT_URI);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing code from query' });
  }

  try {
    console.log("🔁 Fetching token from:", 'https://www.figma.com/api/oauth/token');

    const tokenRes = await fetch('https://www.figma.com/api/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    console.log('🔑 Token Response:', tokenData);

    if (!tokenRes.ok) {
      return res.status(tokenRes.status).json({
        error: 'Failed to fetch token',
        details: tokenData
      });
    }

    return res.status(200).json(tokenData);

  } catch (err: any) {
    console.error('❌ OAuth error:', err);
    return res.status(500).json({
      error: 'OAuth error',
      details: err?.message || err?.toString() || 'Unknown error'
    });
  }
}
