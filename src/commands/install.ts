'use strict';

import blessed = require('blessed');

import commandLine = require('../utils/commandLine');
import commandParser = require('../utils/commandParser');

module.exports = install;

export const usage: string = 'install <github_user>/<github_repo> | <package_directory>';
export const prefix: string = '{blue-fg}♫ xpm{/blue-fg} {yellow-fg}install{/yellow-fg} ';

export function install (): InstallMethods {
	let currentView = null;

	(<InstallMethods> run).run = run;
	return <InstallMethods> run;

	function run (args, view?) {
		if (!view) {
			currentView = view
		}

		const messageBox: commandLine.MessageBoxMethods = commandLine.createMessageBox(view);

		messageBox(exports.prefix + 'Appending package(s): ' + args.attributes, 0);
		messageBox(exports.prefix + 'Testing package manager.', 1);
	}
}

export interface InstallMethods {
	(args: commandParser.ParsedCommand, view: blessed.widget.Screen): void;
	run(args: commandParser.ParsedCommand, view: blessed.widget.Screen): void;
}
