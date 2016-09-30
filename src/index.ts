"use strict";

import blessed = require("blessed");
import _ = require("underscore");

import store = require("./store");
import argv = require("./utils/commandParser");

let view = null;

export function init (): void {
  let command: argv.ParsedCommand = argv.parse(process.argv.slice(2));

  if (view === null) view = blessed.screen({ fastCSR: true, smartCSR: true, autoPadding: true });

  switch (command.action) {
    case "i":
    case "install":
      require("./commands/install")(view, command);
      break;
  }
}

init();
