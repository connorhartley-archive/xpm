"use strict";

import blessed = require("blessed");

module.exports = install;

export const usage: string = "install <github_user>/<github_repo> | <package_directory>";

function install (xpm, store) {
  const screen: blessed.widget.Screen = store.getScreen();
  const box: Function = store.createBox;
  const messages: blessed.widget.Box[] = [];

  return args => {
    const prefix: string = xpm.getPrefix(args.action);
    const packages: string[] = args.attributes;
    const flags: Object[] = args.arguments;
  };

  // Interface Methods (Should be moved somewhere else in the future as all commands will use this.)

  function addLine (text: string, id?: number): number {
    let boxLine: blessed.widget.Box = box();
    boxLine.setContent(text);
    screen.append(boxLine);
    boxLine.focus();
    screen.render();
    if (id !== null) {
      messages[id] = boxLine;
      return id;
    } else return messages.push(boxLine);
  }

  function editLine (text: string, id: number): void {
    let boxLine: blessed.widget.Box = messages[id];
    boxLine.setContent(text);
    screen.render();
    messages[id] = boxLine;
  }

  function removeLine (id: number): void {
    let boxLine: blessed.widget.Box = messages[id];
    boxLine.destroy();
    screen.render();
    messages.slice(id, id + 1);
  }
}
