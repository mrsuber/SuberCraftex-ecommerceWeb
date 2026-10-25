import { mkdir, readFile, stat, writeFile } from 'fs/promises'
import { join, resolve, sep } from 'path'
import { randomUUID } from 'crypto'

/**
 * File storage for uploads.
 *
 * Public files (product photos, banners, booking photos) live in public/uploads and are
 * served by /api/uploads/... to anyone. Private files (KYC documents, payment receipts)
 * live in private-uploads, outside public/, so Next.js can never serve them statically;
 * /api/uploads/... serves them only to their owner and admins.
 *
 * The stored type always comes from the file's own bytes, never from its name or the
 * Content-Type the browser claims, so an upload can never be served as HTML or SVG.
 */

export const PUBLIC_ROOT = join(process.cwd(), 'public', 'uploads')
export const PRIVATE_ROOT = join(process.cwd(), 'private-uploads')

/** Top-level folders whose files are private. */
export const PRIVATE_FOLDERS = ['kyc', 'receipts', 'withdrawal-receipts', 'free-periods'] as const

export type DetectedKind = 'image' | 'video' | 'pdf' | 'docx'

export interface DetectedType {
  kind: DetectedKind
  ext: string
  mime: string
}

const startsWith = (buf: Buffer, bytes: number[], offset = 0) =>
  buf.length >= offset + bytes.length && bytes.every((b, i) => buf[offset + i] === b)

/** Identify a file from its first bytes. Returns null for anything not on the list. */
export function detectFileType(buf: Buffer): DetectedType | null {
  if (startsWith(buf, [0xff, 0xd8, 0xff])) return { kind: 'image', ext: 'jpg', mime: 'image/jpeg' }
  if (startsWith(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    return { kind: 'image', ext: 'png', mime: 'image/png' }
  if (startsWith(buf, [0x47, 0x49, 0x46, 0x38])) return { kind: 'image', ext: 'gif', mime: 'image/gif' }
  if (startsWith(buf, [0x52, 0x49, 0x46, 0x46]) && startsWith(buf, [0x57, 0x45, 0x42, 0x50], 8))
    return { kind: 'image', ext: 'webp', mime: 'image/webp' }
  if (startsWith(buf, [0x25, 0x50, 0x44, 0x46, 0x2d])) return { kind: 'pdf', ext: 'pdf', mime: 'application/pdf' }
  if (startsWith(buf, [0x1a, 0x45, 0xdf, 0xa3])) return { kind: 'video', ext: 'webm', mime: 'video/webm' }
  if (startsWith(buf, [0x66, 0x74, 0x79, 0x70], 4)) {
    const brand = buf.subarray(8, 12).toString('latin1')
    if (brand === 'qt  ') return { kind: 'video', ext: 'mov', mime: 'video/quicktime' }
    return { kind: 'video', ext: 'mp4', mime: 'video/mp4' }
  }
  // DOCX is a ZIP; accept it only when it carries the Word document part
  if (startsWith(buf, [0x50, 0x4b, 0x03, 0x04]) && buf.includes('word/')) {
    return {
      kind: 'docx',
      ext: 'docx',
      mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }
  }
  return null
}

/** Folder names taken from requests must be plain ids: no dots, slashes or spaces. */
export function safeSegment(value: unknown): string | null {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(value) ? value : null
}

export const MB = 1024 * 1024

export const MIME_BY_EXT: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  pdf: 'application/pdf',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export class UploadError extends Error {
  constructor(message: string, public status = 400) {
    super(message)
  }
}

export interface SaveOptions {
  /** Folder path under the upload root, e.g. ['kyc', investorId]. Every part is checked. */
  folder: string[]
  allowed: DetectedKind[]
  maxBytes: number
  /** Private files go outside public/ and are served only after an access check */
  private?: boolean
  /** Optional readable prefix for the file name, e.g. 'id_front' */
  prefix?: string
}

/** Validate and store one uploaded file. Returns the URL that serves it. */
export async function saveUpload(file: File, options: SaveOptions) {
  if (file.size > options.maxBytes) {
    throw new UploadError(`File too large. Maximum size is ${Math.round(options.maxBytes / MB)}MB.`)
  }
  const buffer = Buffer.from(await file.arrayBuffer())
  if (buffer.length > options.maxBytes) {
    throw new UploadError(`File too large. Maximum size is ${Math.round(options.maxBytes / MB)}MB.`)
  }
  const detected = detectFileType(buffer)
  if (!detected || !options.allowed.includes(detected.kind)) {
    throw new UploadError(`This kind of file is not allowed here. Allowed: ${options.allowed.join(', ')}.`)
  }
  for (const part of options.folder) {
    if (!safeSegment(part)) throw new UploadError('Invalid upload folder')
  }
  const prefix = options.prefix && safeSegment(options.prefix) ? `${options.prefix}_` : ''
  const filename = `${prefix}${Date.now()}-${randomUUID()}.${detected.ext}`
  const root = options.private ? PRIVATE_ROOT : PUBLIC_ROOT
  const dir = join(root, ...options.folder)
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, filename), buffer)
  return {
    url: `/api/uploads/${[...options.folder, filename].join('/')}`,
    filename,
    size: buffer.length,
    type: detected.mime,
  }
}

/**
 * Resolve a requested path to a file on disk, refusing anything that escapes the upload
 * roots. Private folders are looked up in private-uploads first, then in the old public
 * location (files uploaded before private storage existed).
 */
export async function locateUpload(parts: string[]) {
  if (parts.length === 0 || parts.some((p) => !p || p === '.' || p === '..' || /[\\/\0]/.test(p))) return null
  const isPrivate = (PRIVATE_FOLDERS as readonly string[]).includes(parts[0])
  const roots = isPrivate ? [PRIVATE_ROOT, PUBLIC_ROOT] : [PUBLIC_ROOT]
  for (const root of roots) {
    const full = resolve(root, ...parts)
    if (!full.startsWith(resolve(root) + sep)) return null
    try {
      const info = await stat(full)
      if (info.isFile()) return { path: full, isPrivate }
    } catch {
      // try the next root
    }
  }
  return null
}

export async function readUpload(path: string) {
  return readFile(path)
}
