/**
 * @fileoverview Rule to prefer absolute imports over relative imports and the module export
 * @author Justin Wallace
 */

import { Rule } from "eslint";
import { ImportDeclaration } from "estree";

import * as fs from "fs";
import * as path from "path";

const findDirWithFile = (filename: string): string => {
  let dir = path.resolve(filename);
  do {
    dir = path.dirname(dir);
  } while (!fs.existsSync(path.join(dir, filename)) && dir !== "/");

  if (!fs.existsSync(path.join(dir, filename))) {
    throw "exit";
  }

  return dir;
};

const getBaseUrl = (baseDir: string) => {
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
};

const inspectImport = (
  node: ImportDeclaration & Rule.NodeParentExtension,
  context: Rule.RuleContext
) => {
  const baseDir = findDirWithFile("package.json");
  const baseUrl = getBaseUrl(baseDir);
  const options = context.options[0] || {};

  const source = node.source.value as string;
  if (source.startsWith(options.allowRootRelative ? ".." : ".")) {
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
      schema: [
        {
          type: "object",
          properties: {
            allowRootRelative: {
              type: "boolean",
            },
          },
          additionalProperties: false,
        },
      ],
    },
    create: function (context: Rule.RuleContext): Rule.RuleListener {
      return {
        ImportDeclaration(node) {
          inspectImport(node, context);
        },
      };
    },
  },
};
