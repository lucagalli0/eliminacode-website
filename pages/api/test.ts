import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await fetch('http://176.221.52.150:8087', {
    method: 'POST',
    body: req.body
  }).then((res) => res.json());

  res.status(200).json(result);
}
