import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Placeholder for presigned URLs. If S3 env is configured, implement signing here.
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { filename } = req.body
  // For now return a simple response. In production generate presigned URL using AWS SDK.
  return res.json({ uploadUrl: null, url: null, message: 'Presign not configured. Configure S3_* env vars to enable.' })
}
