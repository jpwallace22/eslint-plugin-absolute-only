"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
function findDirWithFile(filename) {
    var dir = path.resolve(filename);
    do {
        dir = path.dirname(dir);
    } while (!fs.existsSync(path.join(dir, filename)) && dir !== "/");
    if (!fs.existsSync(path.join(dir, filename))) {
        throw "exit";
    }
    return dir;
}
function getBaseUrl(baseDir) {
    var url = "";
    ["jsconfig.json", "tsconfig.json"].forEach(function (filename) {
        var fpath = path.join(baseDir, filename);
        if (fs.existsSync(fpath)) {
            var config = JSON.parse(fs.readFileSync(fpath).toString());
            if (config && config.compilerOptions && config.compilerOptions.baseUrl) {
                url = config.compilerOptions.baseUrl;
            }
        }
    });
    return path.join(baseDir, url);
}
var noRootRelative = function (node, context) {
    var baseDir = findDirWithFile("package.json");
    var baseUrl = getBaseUrl(baseDir);
    var source = node.source.value;
    if (source.startsWith(".")) {
        var filename = context.getFilename();
        var absolutePath = path.normalize(path.join(path.dirname(filename), source));
        var expectedPath_1 = path.relative(baseUrl, absolutePath);
        if (source !== expectedPath_1) {
            return context.report({
                node: node,
                message: "Relative imports are not allowed. Use `".concat(expectedPath_1, "` instead of `").concat(source, "`."),
                fix: function (fixer) {
                    return fixer.replaceText(node.source, "'".concat(expectedPath_1, "'"));
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
        create: function (context) {
            return {
                ImportDeclaration: function (node) {
                    noRootRelative(node, context);
                },
            };
        },
    },
};
