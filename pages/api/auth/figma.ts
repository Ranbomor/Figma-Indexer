// pages/api/auth/figma.ts

import type { NextApiRequest, NextApiResponse } from 'next';

const CLIENT_ID = process.env.FIGMA_CLIENT_ID!;
const CLIENT_SECRET = process.env.FIGMA_CLIENT_SECRET!;
const REDIRECT_URI = process.env.FIGMA_REDIRECT_URI!;
const TOKEN_URL = 'https://www.figma.com/api/oauth/token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  // הגנה: ודא שה־code קיים
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing code from query' });
  }

  // הכנת בקשת token
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    code,
    grant_type: 'authorization_code',
  });

  try {
    const tokenRes = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const raw = await tokenRes.text();

    if (!tokenRes.ok) {
      return res.status(tokenRes.status).json({
        error: 'Failed to exchange token',
        raw,
      });
    }

    const tokenData = JSON.parse(raw);

    // שמירת הטוקן ב-cookie (לא חובה, זמני)
    res.setHeader('Set-Cookie', `figma_token=${tokenData.access_token}; Path=/; HttpOnly; SameSite=Lax`);

    // שליחה מחדש לעמוד הבית כדי לנקות את ה־URL
    res.writeHead(302, { Location: '/' });
    res.end();

  } catch (err: any) {
    return res.status(500).json({
      error: 'Unexpected error',
      details: err.message || err.toString(),
    });
  }
}
