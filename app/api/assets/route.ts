import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { cwd } from 'node:process'

export function GET() {
  const manifestPath = join(cwd(), './.next/assets-manifest.json')

  return Response.json({
    assets: existsSync(manifestPath)
      ? Object.values(JSON.parse(readFileSync(manifestPath, 'utf-8')))
      : []
  })
}
