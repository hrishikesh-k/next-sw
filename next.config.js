import WebpackAssetsManifest from 'webpack-assets-manifest'

/** @type {import('next').NextConfig} */
const config = {
  outputFileTracingIncludes: {
    '/api/assets': ['./.next/assets-manifest.json']
  },
  webpack: (c) => {
    c.plugins.push(new WebpackAssetsManifest())
    return c
  }
}

export default config
