'use strict'

import minimist = require('minimist')
import _ = require('underscore')

export function parse (args: string[]): ParsedCommand {
  const argv: minimist.ParsedArgs = minimist(args);
  const flags: Flag[] = [];

  _.map(argv, function(value: string | boolean, key: string) {
    if (value || value !== 'false') {
      const obj: Flag = {
        key: key,
        value: value
      };
      flags.push(obj);
    }
  });

  const command: ParsedCommand = {
    action: argv._[0],
    attributes: argv._.slice(1),
    flags: flags.slice(1)
  };

  return command;
}

export interface Flag {
  key: string;
  value: string | boolean;
}

export interface ParsedCommand {
  action: string;
  attributes: string[];
  flags: Flag[];
}
