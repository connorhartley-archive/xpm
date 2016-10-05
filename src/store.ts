'use strict';

import path = require('path')

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
