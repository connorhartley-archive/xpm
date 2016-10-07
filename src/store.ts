'use strict';

import path = require('path')
import fs = require('fs')

const userHome = require('user-home')
const xdgBasedir = require('xdg-basedir')

export const getHomeDirectory: string = userHome
export const getResourceDirectory: string = path.join(xdgBasedir.data, 'xpm') || path.join(getHomeDirectory, '.xpm')
export const getConfigDirectory: string = path.join(xdgBasedir.config, 'xpm') || path.join(getHomeDirectory, '.xpm', 'config')

export const getPlatformName: string = process.env.XANITE_PLATFORM_NAME || 'electron'
export const getPlatformVersion: string = process.env.XANITE_PLATFORM_VERSION || '1.4.2'
export const getPlatformUrl: string = process.env.XANITE_PLATFORM_URL || 'https://atom.io/download/atom-shell'
export const getPlatformArch: string = process.platform === 'darwin' ? 'x64' : (process.platform === 'win32' ? 'ia32' : process.arch)

export const getPackageDirectory: string = path.join(getResourceDirectory, 'packages')
export const getPackageManagerDirectory: string = path.join(getResourceDirectory, '.pnpm')
export const getSharedDirectory: string = path.join(getResourceDirectory, '.shared')
export const getNodeDirectory: string = path.join(getResourceDirectory, '.node-gyp')

export const getPackageManagerEntry: string = require.resolve(path.join(getPackageManagerDirectory, 'lib', 'bin') + 'pnpm')

export const x86Directory: string = process.env['ProgramFiles(x86)'] || process.env['ProgramFiles']

export function getVisualStudioVersion () {
  if (process.platform !== 'win32') { return null }
  if (process.env.GYP_MSVS_VERSION) { return process.env.GYP_MSVS_VERSION }

  if(hasInstalled('10.0')) { return '2010' }
  if(hasInstalled('11.0')) { return '2012' }
  if(hasInstalled('12.0')) { return '2013' }
  if(hasInstalled('14.0')) { return '2015' }

  function hasInstalled(version) {
    fs.existsSync(path.join(x86Directory, 'Microsoft Visual Studio ' + version, 'Common7', 'IDE'))
  }
}
