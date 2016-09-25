"use strict";

import minimist = require("minimist");
import _ = require("underscore");

const installCommand = require("./commands/install");

let argv = minimist(process.argv.slice(2));

export interface CommandObject {
  action: string;
  attributes: string[];
  arguments: Object[];
}

export const queryCommand = command(argv);

init();

function command(argv): Function {
  function parseFlags(argv): Array<Object> {
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
  return function parse(): CommandObject {
    let command: CommandObject = {
      action: argv._[0],
      attributes: argv._.slice(1),
      arguments: parseFlags(argv).slice(1)
    };
    return command;
  };
}

function init() {
  let command = queryCommand();

  switch (command.action) {
    case "install": {
      return installCommand(command);
    }
  }
}
