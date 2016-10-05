'use strict';

import blessed = require('blessed');
import fs = require('fs');
import _ = require('underscore');

import argumentParser = require('../utils/argumentParser');
import commandExecutor = require('../utils/commandExecutor');
import store = require('../store');
import terminalInterface = require('../utils/terminalInterface');

module.exports = install;

export const usage: string = 'install <github_user>/<github_repo> | <package_directory>';
export const prefix: string = '{blue-fg}♫ xpm{/blue-fg} ';

export const installPrefix = prefix + '{yellow-fg}install{/yellow-fg} ';
export const setupPrefix = prefix + '{yellow-fg}setup{/yellow-fg} ';

export function install (): Install {
  let currentView = null;

  (<Install> run).run = run;
  (<Install> run).installNode = installNode;
  (<Install> run).installManager = installManager;
  return <Install> run;

  function run (args, view?) {
    if (!view) {
      currentView = view
    }

    const messageBox: terminalInterface.MessageBox = terminalInterface.createMessageBox(view)

    messageBox(exports.installPrefix + 'Appending package(s): ' + args.attributes)

  }

  function installNode (args, message, callback) {
    const installInput = ['install'];
    installInput.push('--runtime=' + store.getPlatformName)
    installInput.push('--target=' + store.getPlatformVersion)
    installInput.push('--dist-url=' + store.getPlatformUrl)
    installInput.push('--arch=' + store.getPlatformArch)
    installInput.push('--ensure')
    installInput.push('--verbose')

    message.edit(exports.setupPrefix + 'Installing node-gyp before called process.')

    const env = _.extend({}, process.env, { HOME: store.getNodeDirectory })
    env.USERPROFILE  = process.platform !== 'win32' ? env.HOME : null

    fs.mkdirSync(store.getResourceDirectory)

    commandExecutor.executeCommand(require.resolve('node-gyp/bin/node-gyp'), installInput, (exitCode, error, output) => {
      // Somehow log error output here with multiple lines. This won't work currently.
    })
  }

  function installManager (args, message, callback) {
    const installInput = ['install']
    installInput.push('--runtime=' + store.getPlatformName)
    installInput.push('--target=' + store.getPlatformVersion)
    installInput.push('--arch=' + store.getPlatformArch)
    installInput.push('--production')
    installInput.push('--ensure')
    installInput.push('--verbose')

    message.edit(exports.setupPrefix + 'Installing pnpm before called process.')

    fs.mkdirSync(store.getPackageManagerDirectory);
    fs.mkdirSync(store.getSharedDirectory);

    message.edit(exports.setupPrefix + 'Configuring pnpm before called process.')

    const sharedInput = ['config', 'set', 'store-path']
    sharedInput.push(store.getSharedDirectory)
  }
}

export interface Install {
  (args: argumentParser.ParsedCommand, view: blessed.widget.Screen): void
  run(args: argumentParser.ParsedCommand, view: blessed.widget.Screen): void
  installNode(args: argumentParser.ParsedCommand, message: terminalInterface.MessageBox, callback: Function): void
  installManager(args: argumentParser.ParsedCommand, message: terminalInterface.MessageBox, callback: Function): void
}
