"use strict";

import minimist = require("minimist");
import _ = require("underscore");

export function parse (args): ParsedCommand {
  let argv = minimist(args);

  let command: ParsedCommand = {
    action: argv._[0],
    attributes: argv._.slice(1),
    flags: parseFlags().slice(1)
  };

  function parseFlags (): Array<Object> {
    let flags = [];
    _.map(argv, function(value, key) {
      if (value || value !== "false") {
        let obj = {
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
