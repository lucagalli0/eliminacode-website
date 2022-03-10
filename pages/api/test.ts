import type { NextApiRequest, NextApiResponse } from 'next';
import onHeaders from 'on-headers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await fetch('http://176.221.52.150:8087', {
    method: 'POST',
    body: req.body
  }).then((response) => response.json());

  onHeaders(res, function () {
    this.removeHeader('ETag');
  });

  res.status(200).json(result);
}
