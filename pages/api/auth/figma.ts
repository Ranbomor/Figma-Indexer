// pages/api/auth/figma.ts

import type { NextApiRequest, NextApiResponse } from 'next';

const CLIENT_ID = process.env.FIGMA_CLIENT_ID!;
const CLIENT_SECRET = process.env.FIGMA_CLIENT_SECRET!;
const REDIRECT_URI = process.env.FIGMA_REDIRECT_URI!;

console.log('🚨 DEBUG — Using redirect_uri:', REDIRECT_URI);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing code from query' });
  }

  try {
    const tokenURL = 'https://www.figma.com/api/oauth2/token';
    console.log('🔁 Fetching token from:', tokenURL);
    console.log('📤 Sending:', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code,
      grant_type: 'authorization_code',
    });

    const tokenRes = await fetch(tokenURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
        grant_type: 'authorization_code',
      }),
    });

    const raw = await tokenRes.text();
    console.log('🔑 Raw token response:', raw);

    let tokenData;
    try {
      tokenData = JSON.parse(raw);
    } catch (e) {
      console.error('❌ Failed to parse token response JSON');
      return res.status(tokenRes.status).json({
        error: 'Invalid JSON returned from Figma token endpoint',
        raw,
      });
    }

    if (!tokenRes.ok) {
      console.error('❌ Token request failed:', tokenData);
      return res.status(tokenRes.status).json({
        error: 'Failed to fetch token',
        details: tokenData,
      });
    }

    console.log('✅ Token received:', tokenData);
    return res.status(200).json(tokenData);

  } catch (err: any) {
    console.error('❌ OAuth error:', err);
    return res.status(500).json({
      error: 'OAuth error',
      details: err?.message || err?.toString() || 'Unknown error',
    });
  }
}
