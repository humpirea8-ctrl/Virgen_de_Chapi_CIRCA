import { NextApiRequest, NextApiResponse } from 'next'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const provider = process.env.S3_PROVIDER || 'aws'
const bucket = process.env.S3_BUCKET
const region = process.env.S3_REGION || 'us-east-1'
const accessKey = process.env.S3_ACCESS_KEY_ID
const secretKey = process.env.S3_SECRET_ACCESS_KEY
const endpoint = process.env.S3_ENDPOINT || undefined
const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === 'true'
const maxUploadMb = Number(process.env.MAX_UPLOAD_SIZE_MB || '50')
const expiresIn = Number(process.env.PRESIGN_EXPIRES || '900') // seconds (default 15 min)

const ALLOWED_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'video/mp4',
  'image/jpeg',
  'image/png',
  'audio/mpeg',
  'image/jpg'
]

function createS3Client() {
  if (!accessKey || !secretKey || !bucket) throw new Error('S3 not configured. Set S3_* env vars')

  const config: any = {
    region
  }
  if (accessKey && secretKey) config.credentials = { accessKeyId: accessKey, secretAccessKey: secretKey }
  if (endpoint) config.endpoint = endpoint
  if (forcePathStyle) config.forcePathStyle = true

  return new S3Client(config)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { filename, fileType, fileSize, leccionId } = req.body
    if (!filename || !fileType) return res.status(400).json({ error: 'filename and fileType required' })
    // validate size if provided
    if (fileSize && Number(fileSize) > maxUploadMb * 1024 * 1024) return res.status(400).json({ error: `File too large. Max ${maxUploadMb} MB` })
    if (!ALLOWED_MIME.includes(fileType)) return res.status(400).json({ error: 'File type not allowed' })

    const s3 = createS3Client()

    // generate key: aulas/{leccionId}/{timestamp}_{random}_{filename}
    const ts = Date.now()
    const rand = Math.random().toString(36).slice(2, 8)
    const key = `aulas/${leccionId || 'general'}/${ts}_${rand}_${filename}`

    const putCommand = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: fileType })
    const uploadUrl = await getSignedUrl(s3, putCommand, { expiresIn })

    // Also generate a signed GET URL for immediate access (expiring)
    const getCommand = new GetObjectCommand({ Bucket: bucket, Key: key })
    const getUrl = await getSignedUrl(s3, getCommand, { expiresIn })

    return res.json({ uploadUrl, key, getUrl, expiresIn })
  } catch (err: any) {
    console.error('Presign error', err)
    return res.status(500).json({ error: err.message || 'Presign failed' })
  }
}
