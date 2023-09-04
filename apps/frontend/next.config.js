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
    ignoreDuringBuilds: true,
  },
  // TODO remove ts-check during build also (move to separate typecheck step)
}
