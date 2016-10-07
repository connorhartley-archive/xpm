import path = require('path')

import store = require('../store')

export function buildEnv (env?) {
  (<BuildEnv> buildEnv).addWindowsEnv = addWindowsEnv;
  (<BuildEnv> buildEnv).addNodeEnv = addNodeEnv;
  (<BuildEnv> buildEnv).getVisualStudioFlags = getVisualStudioFlags;
  return <BuildEnv> buildEnv;

  function addWindowsEnv () {
    env.USERPROFILE = env.HOME

    const localBin = path.resolve(__dirname, '..', 'node_modules', '.bin')
    if (env.Path) {
      env.Path += path.delimiter + localBin
    } else {
      env.Path = localBin
    }
  }

  function addNodeEnv () {
    const nodeBin = path.resolve(__dirname, '..', 'bin')
    const pathKey = process.platform === 'win32' ? 'Path' : 'PATH'

    if (env[pathKey]) {
      env[pathKey] = nodeBin + path.delimiter + env[pathKey]
    } else {
      env[pathKey] = nodeBin
    }
  }

  function getVisualStudioFlags () {
    const msvsVersion = store.getVisualStudioVersion
    return '--msvs_version=' + msvsVersion
  }
}

export interface BuildEnv {
  (env?: any): void
  addWindowsEnv(): void
  addNodeEnv(): void
  getVisualStudioFlags(): string
}
