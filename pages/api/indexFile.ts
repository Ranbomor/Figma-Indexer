import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.figma_token;

  if (!token) {
    return res.status(401).json({ error: 'Missing Figma access token' });
  }

  const { fileKey } = req.query;
  if (!fileKey || typeof fileKey !== 'string') {
    return res.status(400).json({ error: 'Missing fileKey in query' });
  }

  try {
    const figmaRes = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const raw = await figmaRes.text();
    try {
      const data = JSON.parse(raw);
      if (!figmaRes.ok) {
        return res.status(figmaRes.status).json({ error: 'Figma API error', details: data });
      }
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to parse response from Figma', raw });
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Request to Figma API failed', details: err?.message });
  }
}