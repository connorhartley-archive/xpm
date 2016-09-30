"use strict";

import blessed = require("blessed");
import _ = require("underscore");

import store = require("./store");
import argv = require("./utils/commandParser");

let view = null;
let terminal = null;

export function init (): void {
  let command: argv.ParsedCommand = argv.parse(process.argv.slice(2));

  if (!view) view = blessed.screen({ smartCSR: true, autoPadding: true });

  switch (command.action) {
    case "i":
    case "install":
      require("./commands/install")(view, command);
      break;
  }
}

init();
