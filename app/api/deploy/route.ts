export function GET() {
  return Response.json({
    // @ts-expect-error
    deployId: 'Netlify' in globalThis ? Netlify.context?.deploy?.id : '456'
  })
}
