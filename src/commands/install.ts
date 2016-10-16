'use strict'

import blessed = require('blessed')
import fs = require('fs')
import _ = require('underscore')

import argumentParser = require('../utils/argumentParser')
import buildTools = require('../utils/buildEnv')
import commandExecutor = require('../utils/commandExecutor')
import store = require('../store')
import terminalInterface = require('../utils/terminalInterface')

module.exports = install

export const usage: string = 'install <github_user>/<github_repo> | <package_directory>'
export const prefix: string = '{blue-fg}♫ xpm{/blue-fg} '

export const installPrefix = prefix + '{yellow-fg}install{/yellow-fg} '
export const setupPrefix = prefix + '{yellow-fg}setup{/yellow-fg} '

export function install (): Install {
  let currentView = null;

  (<Install> run).run = run;
  (<Install> run)._installNode = _installNode;
  (<Install> run)._installManager = _installManager;
  (<Install> run)._installModule = _installModule;
  (<Install> run)._installModules = _installModules;
  (<Install> run)._installGeneral = _installGeneral;
  return <Install> run;

  function run (args?, view?) {
    if (!view) {
      currentView = view
    }

    const messageBox: terminalInterface.MessageBox = terminalInterface.createMessageBox(view)

    messageBox(exports.installPrefix + 'Appending package(s): ' + args.attributes)

  }

  function _installNode (args, message, callback) {
    const installInput = ['install']
    installInput.push('--runtime=' + store.getPlatformName)
    installInput.push('--target=' + store.getPlatformVersion)
    installInput.push('--dist-url=' + store.getPlatformUrl)
    installInput.push('--arch=' + store.getPlatformArch)
    installInput.push('--ensure')
    installInput.push('--verbose')

    const env = _.extend({}, process.env, { HOME: store.getNodeDirectory })
    env.USERPROFILE  = process.platform !== 'win32' ? env.HOME : null

    const opts = { env, cwd: store.getResourceDirectory, streaming: true }

    message.add(exports.setupPrefix + 'Installing node-gyp before called process.')

    fs.mkdirSync(store.getResourceDirectory)

    commandExecutor.executeCommand(require.resolve('node-gyp/bin/node-gyp'), installInput, opts, (exitCode, error, output) => {
      if(exitCode === 0) {
        message.edit(exports.setupPrefix + 'Installed node-gyp with success.')
        callback()
      } else {
        callback(output + '\n' + error)
      }
    })
  }

  function _installManager (args, message, callback) {
    const installInput = ['install']
    installInput.push('--runtime=' + store.getPlatformName)
    installInput.push('--target=' + store.getPlatformVersion)
    installInput.push('--arch=' + store.getPlatformArch)
    installInput.push('--production')
    installInput.push('--ensure')
    installInput.push('--verbose')

    const env = _.extend({}, process.env, { HOME: store.getNodeDirectory })
    env.USERPROFILE  = process.platform !== 'win32' ? env.HOME : null

    const opts = { env, cwd: store.getPackageManagerDirectory, streaming: true }

    message.add(exports.setupPrefix + 'Installing pnpm before called process.')

    fs.mkdirSync(store.getPackageManagerDirectory);

    commandExecutor.executeCommand(require.resolve('npm/bin/npm-cli'), installInput, opts, (exitCode, error, output) => {
      if(exitCode === 0) {
        message.edit(exports.setupPrefix + 'Installed pnpm with success.')
        callback()
      } else {
        callback(output + '\n' + error)
      }
    });

    message.add(exports.setupPrefix + 'Configuring pnpm before called process.')

    fs.mkdirSync(store.getSharedDirectory);

    const sharedInput = ['config', 'set', 'store-path']
    sharedInput.push(store.getSharedDirectory)

    commandExecutor.executeCommand(store.getPackageManagerEntry, sharedInput, opts, (exitCode, error, output) => {
      if(exitCode === 0) {
        message.edit(exports.setupPrefix + 'Configured pnpm with success.')
        callback()
      } else {
        callback(output + '\n' + error)
      }
    });
  }

  function _installModule (moduleOpts, args, message, callback) {
    const installInput = ['install']
    installInput.push(moduleOpts.path)
    installInput.push('--runtime=' + store.getPlatformName)
    installInput.push('--target=' + store.getPlatformVersion)
    installInput.push('--arch=' + store.getPlatformArch)
    installInput.push('--verbose')

    _.map(args.flags, function(value: string | boolean, key: string) {
      if(key.length < 2) {
        switch(key) {
          case 'g':
            break;
          default:
            installInput.push('-' + key + '=' + value)
        }
      } else {
        switch(key) {
          case 'global':
            break;
          default:
            installInput.push('--' + key + '=' + value)
        }
      }
    })

    const env = _.extend({}, process.env, { HOME: store.getNodeDirectory })
    env.USERPROFILE  = process.platform !== 'win32' ? env.HOME : null

    const build = buildTools.buildEnv(env)
    build.addNodeEnv()
    if (process.platform === 'win32') { build.addWindowsEnv() }

    const vsArgs = build.getVisualStudioFlags()
    if (vsArgs) { installInput.push(vsArgs) }

    const opts = { env, cwd: moduleOpts.path, streaming: true }

    message.add(exports.installPrefix + 'Installing (' + moduleOpts.name + '@' + moduleOpts.version + ') into the shared directory.')

    fs.mkdirSync(store.getPackageDirectory)

    commandExecutor.executeCommand(store.getPackageManagerEntry, installInput, opts, (exitCode, error, output) => {
      if(exitCode === 0) {
        message.edit(exports.installPrefix + 'Installed successfully.')
        callback()
      } else {
        callback(output + '\n' + error)
      }
    })
  }

  function _installModules (path, args, message, callback) {
    message.add(exports.installPrefix + 'Installing modules.')

    _installGeneral(path, args, message, (exitCode, error, output) => {
      if(exitCode === 0) {
        message.edit(exports.installPrefix + 'Installed package.')
        callback()
      } else {
        callback(output + '\n' + error)
      }
    })
  }

  function _installGeneral (path, args, message, callback) {
    const installInput = ['install']
    installInput.push('--runtime=' + store.getPlatformName)
    installInput.push('--target=' + store.getPlatformVersion)
    installInput.push('--arch=' + store.getPlatformArch)
    installInput.push('--verbose')

    _.map(args.flags, function(value: string | boolean, key: string) {
      if(key.length < 2) {
        switch(key) {
          case 'g':
            break;
          default:
            installInput.push('-' + key + '=' + value)
        }
      } else {
        switch(key) {
          case 'global':
            break;
          default:
            installInput.push('--' + key + '=' + value)
        }
      }
    })

    const env = _.extend({}, process.env, { HOME: store.getNodeDirectory })
    const build = buildTools.buildEnv(env)
    build.addNodeEnv()
    if (process.platform === 'win32') { build.addWindowsEnv() }

    const vsArgs = build.getVisualStudioFlags()
    if (vsArgs) { installInput.push(vsArgs) }

    const opts = { env, cwd: path, streaming: true }

    commandExecutor.executeCommand(store.getPackageManagerEntry, installInput, opts, callback)
  }

  function downloadGitPackage (url, callback) {

  }

  function installGitPackage (path, callback) {

  }
}

export interface Install {
  (args?: argumentParser.ParsedCommand, view?: blessed.widget.Screen): void
  run(args?: argumentParser.ParsedCommand, view?: blessed.widget.Screen): void
  _installNode(args: argumentParser.ParsedCommand, message: terminalInterface.MessageBox, callback: Function): void // Installs NodeGYP
  _installManager(args: argumentParser.ParsedCommand, message: terminalInterface.MessageBox, callback: Function): void // Installs PNPM
  _installModule(module: Module, args: argumentParser.ParsedCommand, message: terminalInterface.MessageBox, callback: Function): void // Installs a single Module under PNPM
  _installModules(path: string, args: argumentParser.ParsedCommand, message: terminalInterface.MessageBox, callback: Function): void // Installs all modules.
  _installGeneral(path: string, args: argumentParser.ParsedCommand, message: terminalInterface.MessageBox, callback: Function): void // Executes the install command through PNPM at the path.
  downloadGitPackage(url: string, callback: Function): void
  installGitPackage(path: string, callback: Function): void
}

export interface Module {
  name: string;
  version: string;
  path: string;
}
