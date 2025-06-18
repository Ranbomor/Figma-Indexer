import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { fileKey } = req.query;
  if (!fileKey || typeof fileKey !== 'string') return res.status(400).json({ error: 'Missing fileKey' });

  const token = process.env.FIGMA_TOKEN;
  const result = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!result.ok) {
    return res.status(result.status).json({ error: 'Figma API error' });
  }

  const data = await result.json();
  res.status(200).json(data);
}
