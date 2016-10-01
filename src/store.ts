'use strict';

import path = require('path');
import fs = require('fs');
import child_process = require('child_process');

const userHome = require('user-home');
const xdgBasedir = require('xdg-basedir');

export function getHomeDirectory(): string {
	return userHome;
}

export function getResourceDirectory(): string {
	return path.join(xdgBasedir.data, 'xpm') || path.join(getHomeDirectory(), '.xpm');
}

export function getConfigDirectory(): string {
	return path.join(xdgBasedir.config, 'xpm') || path.join(getHomeDirectory(), '.xpm', '/config');
}

export function getCacheDirectory(): string {
	return path.join(xdgBasedir.cache, 'xpm') || path.join(getHomeDirectory(), '.xpm', '/cache');
}

// TODO: This function will be refactored.
export function getExecutionPath(callback): void {
	if (process.env.XANITE_EXECUTION_PATH) {
		return process.nextTick(() => {
			callback(process.env.XANITE_EXECUTION_PATH);
		});
	}

	let xpmFolder = path.resolve(__dirname, '..');
	let appFolder = path.dirname(xpmFolder);
	if (path.basename(xpmFolder) === 'xpm' && path.basename(appFolder) === 'app') {
		const asarPath = (appFolder + '.asar');
		if (fs.existsSync(asarPath)) {
			return process.nextTick(() => {
				callback(asarPath);
			});
		}
	}

	xpmFolder = path.resolve(__dirname, '..', '..', '..');
	appFolder = path.dirname(xpmFolder);
	if (path.basename(xpmFolder) === 'xpm' && path.basename(appFolder) === 'app') {
		let asarPath = (appFolder + '.asar');
		if (fs.existsSync(asarPath)) {
			return process.nextTick(() => {
				callback(asarPath);
			});
		}
	}

	switch (process.platform) {
		case 'win32':
			process.nextTick(() => {
				const appLocation = path.join(process.env.ProgramFiles, 'Xanite', 'resources', 'app.asar');
				callback(appLocation);
			});
			break;
		case 'darwin':
			child_process.exec(`mdfind 'kMDItemCFBundleIdentifier == \'io.github.xanite\''`, (error, stdout = '', stderr) => {
				if (!error) {
					const appLocation = (stdout === '' ? '/Applications/Xanite.app' : stdout.split('\n'));
					callback((appLocation + '/Contents/Resources/app.asar'));
				}
			});
			break;
		case 'linux':
			let appLocation = '/usr/local/share/xanite/resources/app.asar';
			if (!fs.existsSync(appLocation)) {
				appLocation = '/usr/share/xanite/resources/app.asar';
			}
			process.nextTick(() => {
				callback(appLocation);
			});
			break;
		default: {
			callback(null);
		}
	}
}
