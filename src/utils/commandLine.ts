"use strict";

import blessed = require("blessed");

module.exports = commandLine;

function commandLine(view) {
  const messages: blessed.widget.Box[] = [];

  addLine.editLine = editLine;
  addLine.removeLine = removeLine;
  return addLine;

  function addLine (text: string, id?: number) {
    let boxLine: blessed.widget.Box = blessed.box({ left: "center", width: "100%", tags: true });
    boxLine.setContent(text);
    view.append(boxLine);
    boxLine.focus();
    view.render();
    if (id !== null) {
      messages[id] = boxLine;
      return id;
    } else return messages.push(boxLine);
  }

  function editLine (text: string, id: number) {
    let boxLine: blessed.widget.Box = messages[id];
    boxLine.setContent(text);
    view.render();
    messages[id] = boxLine;
  }

  function removeLine (id: number) {
    let boxLine: blessed.widget.Box = messages[id];
    boxLine.destroy();
    view.render();
    messages.slice(id, id + 1);
  }
}
