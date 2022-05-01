import { Rule } from "eslint";
import { ImportDeclaration } from "estree";
import * as fs from "fs";
import * as path from "path";

function findDirWithFile(filename: string): string {
  let dir = path.resolve(filename);
  do {
    dir = path.dirname(dir);
  } while (!fs.existsSync(path.join(dir, filename)) && dir !== "/");

  if (!fs.existsSync(path.join(dir, filename))) {
    throw "exit";
  }

  return dir;
}

function getBaseUrl(baseDir: string) {
  let url = "";

  ["jsconfig.json", "tsconfig.json"].forEach(filename => {
    const fpath = path.join(baseDir, filename);
    if (fs.existsSync(fpath)) {
      const config = JSON.parse(fs.readFileSync(fpath).toString());
      if (config && config.compilerOptions && config.compilerOptions.baseUrl) {
        url = config.compilerOptions.baseUrl;
      }
    }
  });

  return path.join(baseDir, url);
}

const noRootRelative = (
  node: ImportDeclaration & Rule.NodeParentExtension,
  context: Rule.RuleContext
) => {
  const baseDir = findDirWithFile("package.json");
  const baseUrl = getBaseUrl(baseDir);

  const source = node.source.value as string;
  if (source.startsWith(".")) {
    const filename = context.getFilename();

    const absolutePath = path.normalize(
      path.join(path.dirname(filename), source)
    );
    const expectedPath = path.relative(baseUrl, absolutePath);

    if (source !== expectedPath) {
      return context.report({
        node,
        message: `Relative imports are not allowed. Use \`${expectedPath}\` instead of \`${source}\`.`,
        fix: function (fixer) {
          return fixer.replaceText(node.source, `'${expectedPath}'`);
        },
      });
    }
  }
};

module.exports.rules = {
  imports: {
    meta: {
      fixable: "code",
      type: "layout",
    },
    create: function (context: Rule.RuleContext): Rule.RuleListener {
      return {
        ImportDeclaration(node) {
          noRootRelative(node, context);
        },
      };
    },
  },
};
