"use strict";

import blessed = require("blessed");

import cli = require("../index");
import store = require("../store");
import commandLine = require("../utils/commandLine");

module.exports = install;

export const usage: string = "install <github_user>/<github_repo> | <package_directory>";
export const prefix: string = " {blue-fg}♫{/blue-fg} {blue-fg}xpm{/blue-fg} {yellow-fg}install{/yellow-fg} ";

function install (view, args) {
  const prefix: string = exports.prefix;
  const messageBox = commandLine(view);

  const packages: string[] = args.attributes;
  const flags: Object[] = args.arguments;

  messageBox.addLine("test");
}
