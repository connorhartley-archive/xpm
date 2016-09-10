# XPM - Xanite Package Manager

XPM (based on [apm](https://github.com/atom/apm)) is built on top of [pnpm](https://github.com/rstacruz/pnpm) instead
of [npm](https://github.com/npm/npm), to make use of pnpm's speed and flat file structure, and uses GitHub as
a registry instead of [npmjs.com](https://npmjs.com), all while ensuring native modules
are built against Chromium's v8 headers.

tl;dr: apm that wraps pnpm instead of npm that can also compile preprocessed modules.

XPM will also compile preprocessed modules before installing, for the following languages.

 - TypeScript
