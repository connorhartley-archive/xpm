"use strict";

import xpm = require("../xpm");

function install(command: xpm.CommandObject) {
  console.log("Running install.");
  console.log(command.attributes);
  console.log(command.arguments);
}
module.exports = install;
