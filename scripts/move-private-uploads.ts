/**
 * One-off: move KYC documents and receipts uploaded before private storage existed from
 * public/uploads into private-uploads, where Next.js can never serve them statically.
 * Stored URLs (/api/uploads/kyc/...) keep working: the uploads route looks in both places.
 *
 * Run on the server from the app folder, before `npm run build`:
 *   npx tsx scripts/move-private-uploads.ts          # shows what would move
 *   npx tsx scripts/move-private-uploads.ts --apply  # moves the files
 */
import { cp, readdir, rm, stat } from 'fs/promises'
import { join } from 'path'
import { PRIVATE_FOLDERS, PRIVATE_ROOT, PUBLIC_ROOT } from '../lib/uploads'

async function main() {
  const apply = process.argv.includes('--apply')
  for (const folder of PRIVATE_FOLDERS) {
    const from = join(PUBLIC_ROOT, folder)
    const to = join(PRIVATE_ROOT, folder)
    try {
      await stat(from)
    } catch {
      console.log(`${folder}: nothing in public/uploads`)
      continue
    }
    const entries = await readdir(from, { recursive: true })
    console.log(`${folder}: ${entries.length} entries ${apply ? 'moving' : 'would move'} to private-uploads`)
    if (apply) {
      // Copy first, delete only after the copy succeeded
      await cp(from, to, { recursive: true, force: false, errorOnExist: false })
      await rm(from, { recursive: true })
    }
  }
  if (!apply) console.log('Dry run. Re-run with --apply to move the files.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
