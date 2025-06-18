import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { fileKey } = req.query;
  if (!fileKey || typeof fileKey !== 'string') {
    return res.status(400).json({ error: 'Missing fileKey' });
  }

  const token = process.env.FIGMA_TOKEN;
  const figmaRes = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const text = await figmaRes.text(); // נבדוק את התשובה הטקסטואלית
  const status = figmaRes.status;

  if (!figmaRes.ok) {
    return res.status(status).json({ error: 'Figma API error', status, details: text });
  }

  try {
    const data = JSON.parse(text);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to parse JSON', raw: text });
  }
}
