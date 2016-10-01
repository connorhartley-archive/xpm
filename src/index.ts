"use strict";

import blessed = require("blessed");
import _ = require("underscore");

import store = require("./store");
import argv = require("./utils/commandParser");

let view = null;
let terminal = null;

export const commands = {
  install: require("./commands/install")()
};

export function init (): void {
  let command: argv.ParsedCommand = argv.parse(process.argv.slice(2));

  if (!view) view = blessed.screen({ smartCSR: true, autoPadding: true });

  switch (command.action) {
    case "i":
    case "install":
      commands.install(command, view);
      break;
  }
}

init();
