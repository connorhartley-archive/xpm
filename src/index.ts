'use strict';

import blessed = require('blessed');

import argp = require('./utils/argumentParser');

let view = null;

export const commands = {
  install: require('./commands/install')(),
  preinstall: require('./commands/preinstall')()
};

export function init (): void {
  const command: argp.ParsedCommand = argp.parse(process.argv.slice(2));

  if (!view) {
    view = blessed.screen({ smartCSR: true });
  }

  switch (command.action) {
    case 'preinstall':
      commands.preinstall(command, view)
      break;
    case 'i':
    case 'install':
      commands.install(command, view);
      break;
    default:
      return;
  }
}

init();
