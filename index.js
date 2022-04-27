"use strict";

const fs = require( "fs");
const path = require( "path");

function findDirWithFile(filename) {
  // start at our CWD and traverse upwards until we either hit the root "/" or find a directory with our file
  let dir = path.resolve(filename);
  do {
    dir = path.dirname(dir);
  } while (!fs.existsSync(path.join(dir, filename)) && dir !== "/");

  if (!fs.existsSync(path.join(dir, filename))) {
    return;
  }

  return dir;
}

function getBaseUrl() {
  const baseDir = findDirWithFile("package.json");
  let url = "";

  // tsconfig.json will override jsconfig.json
  ["jsconfig.json", "tsconfig.json"].forEach(filename => {
    const fpath = path.join(baseDir, filename);
    if (fs.existsSync(fpath)) {
      const config = JSON.parse(fs.readFileSync(fpath));
      if (config && config.compilerOptions && config.compilerOptions.baseUrl) {
        url = config.compilerOptions.baseUrl;
      }
    }
  });

  return path.join(baseDir, url);
}

module.exports.rules = {
  "only-absolute-imports": {
    meta: {
      fixable: true,
    },
    create: function (context) {
      const baseDir = findDirWithFile("package.json");
      const baseUrl = getBaseUrl(baseDir);

      return {
        ImportDeclaration(node) {
          const source = node.source.value;
          if (source.startsWith(".")) {
            const filename = context.getFilename();

            const absolutePath = path.normalize(
              path.join(path.dirname(filename), source)
            );
            const expectedPath = path.relative(baseUrl, absolutePath);

            if (source !== expectedPath) {
              context.report({
                node,
                message: `Relative imports are not allowed. Use \`${expectedPath}\` instead of \`${source}\`.`,
                fix: function (fixer) {
                  return fixer.replaceText(node.source, `'${expectedPath}'`);
                },
              });
            }
          }
        },
      };
    },
  },
};
