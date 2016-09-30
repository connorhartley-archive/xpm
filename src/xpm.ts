"use strict";

import blessed = require("blessed");
import minimist = require("minimist");
import _ = require("underscore");

exports = module.exports = {};

const store = require("./store");

const install = require("./commands/install")(exports, store);

const argv = minimist(process.argv.slice(2));

let screen = null;

interface CommandObject {
  action: string;
  attributes: string[];
  arguments: Object[];
}

export const queryCommand: () => CommandObject = command(argv);

export function getPrefix (action: string): string {
  return " {blue-fg}♫{/blue-fg} {blue-fg}xpm{/blue-fg} {yellow-fg}" + action + "{/yellow-fg} ";
}

export function getScreen (): blessed.widget.Screen {
  if (!screen) screen = blessed.screen({ smartCSR: true });
  return screen;
}

export function createBox (): blessed.widget.Box {
  return blessed.box({ left: "center", width: "100%", tags: true });
}

init();

// Move somewhere else.
export function command (argv): () => CommandObject {
  function parseFlags (argv): Array<Object> {
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
  return function parse (): CommandObject {
    let command: CommandObject = {
      action: argv._[0],
      attributes: argv._.slice(1),
      arguments: parseFlags(argv).slice(1)
    };
    return command;
  };
}

export function init (): void {
  let command = queryCommand();

  switch (command.action) {
    case "i":
    case "install":
      install(command);
      break;
  }
}
