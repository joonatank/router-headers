const path = require('path')

/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  experimental: {
    // this includes files from the monorepo base two directories up
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  productionBrowserSourceMaps: true,
  // Lint is a separate step on the CI
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // TODO remove ts-check during build also (move to separate typecheck step)
}
