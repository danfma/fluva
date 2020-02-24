const { series } = require('nps-utils')

module.exports = {
  scripts: {
    build: {
      es5: 'tsc -p .',
      es2015: 'tsc -p . --target es2015 --module esnext --outDir lib/es2015',
      default: series.nps('build.es5', 'build.es2015')
    }
  }
}
