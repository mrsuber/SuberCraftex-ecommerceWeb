import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { mkdir, rm, writeFile } from 'fs/promises'
import { join } from 'path'
import { detectFileType, locateUpload, PRIVATE_ROOT, PUBLIC_ROOT, safeSegment } from '@/lib/uploads'
import { makeUser, resetDb } from './helpers/db'
import { db } from '@/lib/db'

const session = vi.hoisted(() => ({ user: null as any }))
vi.mock('@/lib/auth/session', async (importOriginal) => {
  const real = await importOriginal<typeof import('@/lib/auth/session')>()
  return { ...real, getSession: async () => session.user }
})

const { POST: upload } = await import('@/app/api/upload/route')
const { GET: serve } = await import('@/app/api/uploads/[...path]/route')

const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex')
const SVG = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>')

function form(fields: Record<string, string>, bytes: Buffer, name = 'photo.png', type = 'image/png') {
  const fd = new FormData()
  fd.append('file', new File([new Uint8Array(bytes)], name, { type }))
  for (const [k, v] of Object.entries(fields)) fd.append(k, v)
  return new Request('http://test/api/upload', { method: 'POST', body: fd }) as any
}

const serveReq = (parts: string[]) =>
  serve(new Request(`http://test/api/uploads/${parts.join('/')}`) as any, { params: Promise.resolve({ path: parts }) })

const TEST_FOLDERS: string[] = []

describe('file type detection', () => {
  it('reads the type from the bytes, not the name', () => {
    expect(detectFileType(PNG)?.ext).toBe('png')
    expect(detectFileType(Buffer.from('ffd8ffe000104a46', 'hex'))?.ext).toBe('jpg')
    expect(detectFileType(Buffer.from('%PDF-1.7 ...'))?.kind).toBe('pdf')
    expect(detectFileType(SVG)).toBeNull()
    expect(detectFileType(Buffer.from('<html><script>1</script></html>'))).toBeNull()
  })

  it('only allows plain ids as folder names', () => {
    expect(safeSegment('a1b2-c3_d4')).toBe('a1b2-c3_d4')
    expect(safeSegment('../../etc')).toBeNull()
    expect(safeSegment('a/b')).toBeNull()
    expect(safeSegment('')).toBeNull()
  })
})

describe('locating uploads', () => {
  it('refuses paths that climb out of the upload folders', async () => {
    expect(await locateUpload(['..', 'package.json'])).toBeNull()
    expect(await locateUpload(['products', '..', '..', 'package.json'])).toBeNull()
    expect(await locateUpload(['products/../../package.json'])).toBeNull()
  })
})

describe('upload endpoint', () => {
  beforeAll(resetDb)
  beforeEach(() => {
    session.user = null
  })
  afterAll(async () => {
    for (const folder of TEST_FOLDERS) {
      await rm(join(PUBLIC_ROOT, folder), { recursive: true, force: true })
      await rm(join(PRIVATE_ROOT, folder), { recursive: true, force: true })
    }
  })

  it('lets guests attach booking photos, images only', async () => {
    const ok = await upload(form({ type: 'requirement' }, PNG))
    expect(ok.status).toBe(201)
    const body = await ok.json()
    expect(body.url).toMatch(/^\/api\/uploads\/intake\/requirement\/\d+-[0-9a-f-]+\.png$/)
    TEST_FOLDERS.push('intake')

    const svg = await upload(form({ type: 'requirement' }, SVG, 'evil.svg', 'image/png'))
    expect(svg.status).toBe(400)
  })

  it('stores the real type whatever extension the sender claims', async () => {
    const res = await upload(form({ type: 'requirement' }, PNG, 'page.html', 'text/html'))
    expect(res.status).toBe(201)
    expect((await res.json()).url).toMatch(/\.png$/)
  })

  it('refuses everything else without a login, and wrong roles with one', async () => {
    expect((await upload(form({}, PNG))).status).toBe(401)
    expect((await upload(form({ type: 'banner' }, PNG))).status).toBe(401)
    session.user = { id: 'c1', role: 'customer' }
    expect((await upload(form({ type: 'banner' }, PNG))).status).toBe(403)
    expect((await upload(form({}, PNG))).status).toBe(403)
  })

  it('refuses folder names that try to escape', async () => {
    session.user = { id: 'd1', role: 'driver' }
    const res = await upload(form({ type: 'photo', deliveryId: '../../../app' }, PNG))
    expect(res.status).toBe(400)
  })

  it('serves KYC files only to their investor and admins', async () => {
    const owner = await makeUser('investor')
    const other = await makeUser('investor')
    const investor = await db.investor.create({
      data: { userId: owner.id, investorNumber: 'INV-T-1', fullName: 'Owner', email: owner.email, phone: '677000000' },
    })
    await db.investor.create({
      data: { userId: other.id, investorNumber: 'INV-T-2', fullName: 'Other', email: other.email, phone: '677000001' },
    })
    const dir = join(PRIVATE_ROOT, 'kyc', investor.id)
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, 'id_front.png'), PNG)
    TEST_FOLDERS.push(join('kyc', investor.id))
    const parts = ['kyc', investor.id, 'id_front.png']

    session.user = null
    expect((await serveReq(parts)).status).toBe(404)
    session.user = { id: other.id, role: 'investor' }
    expect((await serveReq(parts)).status).toBe(404)
    session.user = { id: owner.id, role: 'investor' }
    const mine = await serveReq(parts)
    expect(mine.status).toBe(200)
    expect(mine.headers.get('cache-control')).toContain('no-store')
    session.user = { id: 'admin', role: 'admin' }
    expect((await serveReq(parts)).status).toBe(200)
  })

  it('still finds KYC files uploaded before private storage, behind the same check', async () => {
    const owner = await makeUser('investor')
    const investor = await db.investor.create({
      data: { userId: owner.id, investorNumber: 'INV-T-3', fullName: 'Old', email: owner.email, phone: '677000002' },
    })
    const dir = join(PUBLIC_ROOT, 'kyc', investor.id)
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, 'selfie.png'), PNG)
    TEST_FOLDERS.push(join('kyc', investor.id))
    const parts = ['kyc', investor.id, 'selfie.png']
    session.user = null
    expect((await serveReq(parts)).status).toBe(404)
    session.user = { id: owner.id, role: 'investor' }
    expect((await serveReq(parts)).status).toBe(200)
  })

  it('serves old files with unknown extensions as downloads, never as pages', async () => {
    const dir = join(PUBLIC_ROOT, 'zz-test')
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, 'x.svg'), SVG)
    TEST_FOLDERS.push('zz-test')
    const res = await serveReq(['zz-test', 'x.svg'])
    expect(res.headers.get('content-type')).toBe('application/octet-stream')
    expect(res.headers.get('content-disposition')).toBe('attachment')
    expect(res.headers.get('x-content-type-options')).toBe('nosniff')
  })
})
