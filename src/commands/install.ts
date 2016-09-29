"use strict";

import blessed = require("blessed");
import xpm = require("../xpm");

export interface ModuleProperties {
  name: string;
  version: string;
}

/**
 * Incomplete command, used to show how commands will be implemented.
 * (Hence why this is quite messy)
 */
function install(command: xpm.CommandObject, screen: blessed.widget.Screen) {
  let prefix = " {blue-fg}♫{/blue-fg} {blue-fg}xpm{/blue-fg} {yellow-fg}install{/yellow-fg} ";

  screen.title = "xpm " + command.action;
  let contentBox = blessed.box({
    left: "center",
    width: "100%",
    content: prefix + "Appending package.",
    tags: true,
    padding: {
      bottom: 1
    }
  });

  screen.key(["escape", "q", "C-c"], function(ch, key) {
    return process.exit(0);
  });

  screen.append(contentBox);
  contentBox.focus();
  screen.render();
}
module.exports = install;
