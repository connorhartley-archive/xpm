'use strict';

import blessed = require('blessed')

export function createMessageBox(view: blessed.widget.Screen): MessageBox {
  const messageText: blessed.widget.Box[] = []
  let message: blessed.widget.Box = null;
  let currentLine: number = 0;

  (<MessageBox> add).add = add;
  (<MessageBox> add).edit = edit;
  (<MessageBox> add).remove = remove;
  return <MessageBox> add;

  function add (text: string, id?: number) {
    if (id === null || id === undefined) {
      id = currentLine;
      currentLine = (currentLine + 1)
    }

    if (!message) {
      message = blessed.box({ width: view.width, height: (id + 1), top: 0, left: 'center' })
    }

    message.height = (id + 1)

    const line = blessed.box({ height: 1, top: id, left: 1, right: 1, content: text, tags: true });

    message.append(line)
    view.append(message)

    view.on('resize', function() {
      message.width = view.width
      view.render()
    });

    message.show()
    line.show()

    view.render()

    return id
  }

  function edit (text: string, id?: number) {
    if (id === null || id === undefined) {
      id = currentLine
    }

    const msgTxt = messageText[(id - 1)]

    msgTxt.setContent(text)
    msgTxt.show()

    view.render()

    return id
  }

  function remove (id?: number) {
    if (id === null || id === undefined) {
      id = currentLine;
      currentLine = (currentLine - 1)
    }

    const msgTxt = messageText[(id - 1)]

    msgTxt.destroy()

    view.render()

    messageText.splice((id - 1), 1)
  }
}

export interface MessageBox {
  (text: string, id?: number): number;
  add(text: string, id?: number): number;
  edit(text: string, id: number): void;
  remove(id: number): void;
}
