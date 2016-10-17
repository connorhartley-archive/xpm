'use strict'

import blessed  = require('blessed')
import fs       = require('fs')

import argp     = require('../utils/argumentParser')
import executor = require('../utils/commandExecutor')
import store    = require('../store')
import terminal = require('../utils/terminalInterface')

module.exports = preinstall

export const prefix: string = '{blue-fg}♫ xpm{/blue-fg} {yellow-fg}preinstall{/yellow-fg} '

export function preinstall () {

  (<PreInstall> run).run = run;
  (<PreInstall> run)._installNodeGyp = _installNodeGyp;
  (<PreInstall> run)._installPackageManager = _installPackageManager;
  return <PreInstall> run;

  function run (args, view) {
    // TODO
  }

  function _installNodeGyp (args, message, callback) {
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

    fs.mkdirSync(store.getResourceDirectory)

    executor.executeCommand(require.resolve('node-gyp/bin/node-gyp'), installInput, opts, (exitCode, error, output) => {
      if(exitCode === 0) {
        callback()
      } else {
        callback(output + '\n' + error)
      }
    })
  }

  function _installPackageManager (args, message, callback) {
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

    fs.mkdirSync(store.getPackageManagerDirectory)

    executor.executeCommand(require.resolve('npm/bin/npm-cli'), installInput, opts, (exitCode, error, output) => {
      if(exitCode === 0) {
        callback()
      } else {
        callback(output + '\n' + error)
      }
    })
  }

  function _configurePackageManager (args, message, callback) {
    const env = _.extend({}, process.env, { HOME: store.getNodeDirectory })
    env.USERPROFILE  = process.platform !== 'win32' ? env.HOME : null

    const opts = { env, cwd: store.getPackageManagerDirectory, streaming: true }

    fs.mkdirSync(store.getSharedDirectory);

    const sharedInput = ['config', 'set', 'store-path']
    sharedInput.push(store.getSharedDirectory)

    executor.executeCommand(store.getPackageManagerEntry, sharedInput, opts, (exitCode, error, output) => {
      if(exitCode === 0) {
        callback()
      } else {
        callback(output + '\n' + error)
      }
    })
  }
}

export interface PreInstall {
  (args?: argp.ParsedCommand, view?: blessed.widget.Screen): void
  run(args?: argp.ParsedCommand, view?: blessed.widget.Screen): void
  _installNodeGyp(args: argp.ParsedCommand, message: terminal.MessageBox, callback: Function): void
  _installPackageManager(args: argp.ParsedCommand, message: terminal.MessageBox, callback: Function): void
  _configurePackageManager(args: argp.ParsedCommand, message: terminal.MessageBox, callback: Function): void
}
