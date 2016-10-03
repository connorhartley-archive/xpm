'use strict';

import blessed = require('blessed');
import fs = require('fs');

import store = require('../store');
import commandLine = require('../utils/commandLine');
import commandParser = require('../utils/commandParser');

const logcb = require('log-cb');

module.exports = install;

export const usage: string = 'install <github_user>/<github_repo> | <package_directory>';
export const prefix: string = '{blue-fg}♫ xpm{/blue-fg} {yellow-fg}install{/yellow-fg} ';

export function install (): Install {
	let currentView = null;

	(<Install> run).run = run;
	(<Install> run).installNode = installNode;
	(<Install> run).installManager = installManager;
	return <Install> run;

	function run (args, view?) {
		if (!view) {
			currentView = view
		}

		const messageBox: commandLine.MessageBox = commandLine.createMessageBox(view);

		messageBox(exports.prefix + 'Appending package(s): ' + args.attributes, 0);

		// TEST

		installNode(args, messageBox, logcb('Installed node-gyp successfully.', 'Failed to install node-gyp.'));
		installManager(args, messageBox, logcb('Installed pnpm successfully.', 'Failed to install pnpm.'));
	}

	function installNode (args, message, callback) {
		const installInput = ['install'];
		installInput.push('--runtime=' + store.getPlatformName);
		installInput.push('--target=' + store.getPlatformVersion);
		installInput.push('--dist-url=' + store.getPlatformUrl);
		installInput.push('--arch=' + store.getPlatformArch);
		installInput.push('--ensure');
		installInput.push('--verbose');

		const env = _.extend({}, process.env, { HOME: store.getNodeDirectory });
		env.USERPROFILE  = process.platform !== 'win32' ? env.HOME : null;

		fs.mkdirSync(store.getResourceDirectory);
	}

	function installManager (args, message, callback) {
		const installInput = ['install']
		installInput.push('--runtime=' + store.getPlatformName);
		installInput.push('--target=' + store.getPlatformVersion);
		installInput.push('--arch=' + store.getPlatformArch);
		installInput.push('--production');
		installInput.push('--ensure');
		installInput.push('--verbose');
	}
}

export interface Install {
	(args: commandParser.ParsedCommand, view: blessed.widget.Screen): void;
	run(args: commandParser.ParsedCommand, view: blessed.widget.Screen): void;
	installNode(args: commandParser.ParsedCommand, message: commandLine.MessageBox, callback: Function): void;
	installManager(args: commandParser.ParsedCommand, message: commandLine.MessageBox, callback: Function): void;
}
