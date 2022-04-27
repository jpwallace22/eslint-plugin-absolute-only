# eslint-plugin-absolute-only

A (zero-dependency!) eslint plugin that enforces absolute imports on your codebase.

## Prerequisites

You must have a `baseUrl` defined in either `tsconfig.json` or `jsconfig.json`. **This plugin does not currently work with `paths`!**

## Setup

- `npm i eslint-plugin-absolute-only --save-dev ` OR `yarn add eslint-plugin-absolute-only --save-dev`
- Add `"eslint-plugin-absolute-only"` to your eslint `plugins` section
- Add `"absolute-only/imports": "error"` to your eslint `rules` section

## License

MIT
