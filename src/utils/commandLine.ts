"use strict";

import blessed = require("blessed");

export function createMessageBox(view): LineMethods {
  const messages: blessed.widget.Box[] = [];

  (<LineMethods> add).add = add;
  (<LineMethods> add).edit = edit;
  (<LineMethods> add).remove = remove;
  return <LineMethods> add;

  function add (text: string, id?: number) {
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

  function edit (text: string, id: number) {
    let boxLine: blessed.widget.Box = messages[id];
    boxLine.setContent(text);
    view.render();
    messages[id] = boxLine;
  }

  function remove (id: number) {
    let boxLine: blessed.widget.Box = messages[id];
    boxLine.destroy();
    view.render();
    messages.slice(id, id + 1);
  }
}

export interface LineMethods {
  (text: string, id?: number): number;
  add(text: string, id?: number): number;
  edit(text: string, id: number): void;
  remove(id: number): void;
}
