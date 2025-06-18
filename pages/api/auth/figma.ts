
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
    const tokenUrl = 'https://api.figma.com/v1/oauth/token';

    const payload = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code,
      grant_type: 'authorization_code',
    });

    console.log("🔁 Fetching token from:", tokenUrl);
    console.log("📨 Sending:", Object.fromEntries(payload.entries()));

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload.toString(),
    });

    const rawText = await tokenRes.text();
    console.log("🔓 Raw token response:", rawText);

    if (!tokenRes.ok) {
      return res.status(tokenRes.status).json({
        error: 'Token request failed',
        status: tokenRes.status,
        response: rawText,
      });
    }

    try {
      const tokenData = JSON.parse(rawText);
      return res.status(200).json(tokenData);
    } catch (jsonErr) {
      console.error('❌ Failed to parse token response JSON');
      return res.status(500).json({
        error: 'Invalid JSON in token response',
        raw: rawText,
      });
    }

  } catch (err: any) {
    console.error('❌ OAuth error:', err);
    return res.status(500).json({
      error: 'OAuth error',
      details: err?.message || err?.toString() || 'Unknown error'
    });
  }
}
