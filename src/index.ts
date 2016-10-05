'use strict';

import blessed = require('blessed');

import argv = require('./utils/argumentParser');

let view = null;

export const commands = {
  install: require('./commands/install')()
};

export function init (): void {
  const command: argv.ParsedCommand = argv.parse(process.argv.slice(2));

  if (!view) {
    view = blessed.screen({ smartCSR: true });
  }

  switch (command.action) {
    case 'i':
    case 'install':
      commands.install(command, view);
      break;
    default:
      return;
  }
}

init();
