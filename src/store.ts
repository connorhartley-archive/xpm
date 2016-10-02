'use strict';

import path = require('path');

const userHome = require('user-home')();
const xdgBasedir = require('xdg-basedir');

export const getHomeDirectory: string = userHome;
export const getResourceDirectory: string = path.join(xdgBasedir.data, 'xpm') || path.join(getHomeDirectory, '.xpm');
export const getConfigDirectory: string = path.join(xdgBasedir.config, 'xpm') || path.join(getHomeDirectory, '.xpm', '/config');
export const getCacheDirectory: string = path.join(xdgBasedir.cache, 'xpm') || path.join(getHomeDirectory, '.xpm', '/cache');
