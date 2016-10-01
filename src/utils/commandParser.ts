'use strict';

import minimist = require('minimist');
import _ = require('underscore');

export function parse (args): ParsedCommand {
	const argv = minimist(args);

	const command: ParsedCommand = {
		action: argv._[0],
		attributes: argv._.slice(1),
		flags: parseFlags().slice(1)
	};

	function parseFlags (): Array<Object> {
		const flags = [];
		_.map(argv, function(value, key) {
			if (value || value !== 'false') {
				const obj = {
					key: key,
					value: value
				};
				flags.push(obj);
			}
		});
		return flags;
	}

	return command;
}

export interface ParsedCommand {
	action: string;
	attributes: string[];
	flags: Object[];
}
