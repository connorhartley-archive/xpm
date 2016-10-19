'use strict'

import blessed = require('blessed')
import fs      = require('fs')
import path    = require('path')
import _       = require('underscore')
import tmp     = require('tmp')

const git = require('nodegit')
const mv  = require('mv')

import argp       = require('../utils/argumentParser')
import buildTools = require('../utils/buildEnv')
import executor   = require('../utils/commandExecutor')
import store      = require('../store')
import terminal   = require('../utils/terminalInterface')

module.exports = install

export const usage: string = 'install <github_user>/<github_repo> | <package_directory>'
export const prefix: string = '{blue-fg}♫ xpm{/blue-fg} {yellow-fg}install{/yellow-fg} '

export function install (): Install {
  let currentView = null;

  (<Install> run).run = run;
  (<Install> run)._installModule = _installModule;
  (<Install> run)._installModules = _installModules;
  (<Install> run)._installGeneral = _installGeneral;
  return <Install> run;

  function run (args?, view?) {
    if (!view) {
      currentView = view
    }

    const messageBox: terminal.MessageBox = terminal.createMessageBox(view)

    messageBox(exports.prefix + 'Appending package(s): ' + args.attributes)

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

    message.add(exports.prefix + 'Installing (' + moduleOpts.name + '@' + moduleOpts.version + ') into the shared directory.')

    fs.mkdirSync(store.getPackageDirectory)

    executor.executeCommand(store.getPackageManagerEntry, installInput, opts, (exitCode, error, output) => {
      if(exitCode === 0) {
        message.edit(exports.prefix + 'Installed successfully.')
        callback()
      } else {
        callback(output + '\n' + error)
      }
    })
  }

  function _installModules (path, args, message, callback) {
    message.add(exports.prefix + 'Installing modules.')

    _installGeneral(path, args, message, (exitCode, error, output) => {
      if(exitCode === 0) {
        message.edit(exports.prefix + 'Installed package.')
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

    executor.executeCommand(store.getPackageManagerEntry, installInput, opts, callback)
  }

  function  cloneGitPackage (url, callback) {
    cloneToTemp(function (dir, tmp) {
      moveFromTemp(dir, function (dir) {
        callback(dir)
        tmp.setGracefulCleanup()
      })
    })

    function moveFromTemp (dir, callback) {
      mv(dir, path.join(store.getPackageDirectory, require(dir + path.delimiter + 'package.json').name), { mkdirp: true }, function (err) {
        callback(dir)
      })
    }

    function cloneToTemp (callback) {
      var tmp = tmp.dir({ dir: store.getCacheDirectory, prefix: 'package_' }, function tempDirCreated(err, dir) {
        git.Clone(url, dir).then(function (repository) {
          callback(dir, tmp)
        })
      })
    }
  }
}

export interface Install {
  (args?: argp.ParsedCommand, view?: blessed.widget.Screen): void
  run(args?: argp.ParsedCommand, view?: blessed.widget.Screen): void
  _installModule(module: Module, args: argp.ParsedCommand, message: terminal.MessageBox, callback: Function): void // Installs a single Module under PNPM
  _installModules(path: string, args: argp.ParsedCommand, message: terminal.MessageBox, callback: Function): void // Installs all modules.
  _installGeneral(path: string, args: argp.ParsedCommand, message: terminal.MessageBox, callback: Function): void // Executes the install command through PNPM at the path.
  cloneGitPackage(url: string, callback: Function): void
  downloadGitPackage(url: string, callback: Function): void
}

export interface Module {
  name: string;
  version: string;
  path: string;
}
