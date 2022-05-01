# eslint-plugin-absolute-only

ESLint zero dependency plugin to prefer absolute imports. By default, the plugin strictly allows absolute imports. However, with the `allowRootRelative` setting, you can be a little more relaxed if you prefer.

This plugin will automatically fix your code using ESLint's --fix option.

It is written in Typescript and I am always open to requests, advice and PR's. Happy hacking!

## Prerequisites

You must have a `"baseUrl"` defined in either `tsconfig.json` or `jsconfig.json`. **This plugin does not currently work with `paths`!**

## Setup

Install the npm package

```bash
#install locally with yarn
yarn add eslint-plugin-absolute-only -D

#install locally with npm
npm i eslint-plugin-absolute-only --save-dev
```

Add the plugin to the `plugins` section and the rule to the `rules` section in your .eslintrc

```json
"plugins": [
  "absolute-only"
],
"rules": {
  "absolute-only/imports": [ "error", { "allowRootRelative": true } ],
}
```

## Configuration

Under the `rules` section in your .eslintrc you can set the `"error"` to `"off"` to display nothing, or `"warn"` for a warning.

`"allowRootRelative"` can be set `false` to enforce a strict absolute pattern, or `true` to allow root relative imports.

## Autofixing

To autofix your code, simply run ESLint with the `--fix` option.

```bash
eslint --fix src
```

## License

MIT
