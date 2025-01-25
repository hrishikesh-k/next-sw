import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/deploy') {
    return NextResponse.json({
      // @ts-expect-error
      deployId: 'Netlify' in globalThis ? Netlify?.context?.deploy?.id : ''
    })
  }
}

export const config = {
  matcher: ['/deploy']
}
