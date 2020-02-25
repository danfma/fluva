const { series } = require("nps-utils")

module.exports = {
  scripts: {
    build: {
      es5: "tsc -p tsconfig.build.json",
      es2015: "tsc -p tsconfig.build.json --target es2015 --module esnext --outDir lib/es2015",
      default: series.nps("build.es5", "build.es2015")
    },

    test: {
      watch: "jest --watch",
      default: "jest"
    }
  }
}
