"use strict";

import os = require("os");
import path = require("path");
import fs = require("fs");
import child_process = require("child_process");

// These dependencies have no typescript declaration.
const osenv = require("osenv");
const userHome = require("user-home");
const xdgBasedir = require("xdg-basedir");

export function getHomeDirectory(): string {
  return userHome;
}

export function getConfigDirectory(): string {
  return path.join(xdgBasedir.config, "xpm") || path.join(os.tmpdir, osenv.user(), ".xpm");
}

export function getPackageDirectory(): string {
  return path.join(xdgBasedir.data, "xpm", "/packages") || path.join(os.tmpdir, osenv.user(), ".xpm", "/packages");
}

export function getCacheDirectory(): string {
  return path.join(xdgBasedir.cache, "xpm") || path.join(os.tmpdir, osenv.user(), ".xpm", "/cache");
}

export function getResourcePath(callback): void {
  if (process.env.XANITE_RESOURCE_PATH) {
    return process.nextTick(() => {
      callback(process.env.XANITE_RESOURCE_PATH, true);
    });
  }

  let xpmFolder = path.resolve(__dirname, "..");
  let appFolder = path.dirname(xpmFolder);
  if (path.basename(xpmFolder) === "xpm" && path.basename(appFolder) === "app") {
    let asarPath = (appFolder + ".asar");
    if (fs.existsSync(asarPath)) {
      return process.nextTick(() => {
        callback(asarPath, true);
      });
    }
  }

  xpmFolder = path.resolve(__dirname, "..", "..", "..");
  appFolder = path.dirname(xpmFolder);
  if (path.basename(xpmFolder) === "xpm" && path.basename(appFolder) === "app") {
    let asarPath = (appFolder + ".asar");
    if (fs.existsSync(asarPath)) {
      return process.nextTick(() => {
        callback(asarPath, true);
      });
    }
  }

  switch (process.platform) {
    case "win32": {
      process.nextTick(() => {
        const appLocation = path.join(process.env.ProgramFiles, "Xanite", "resources", "app.asar");
        callback(appLocation, true);
      });
      return;
    }
    case "darwin": {
      child_process.exec(`mdfind "kMDItemCFBundleIdentifier == \'io.github.xanite\'"`, (error, stdout = "", stderr) => {
        if (!error) {
          let appLocation = (stdout === "" ? "/Applications/Xanite.app" : stdout.split("\n"));
          callback((appLocation + "/Contents/Resources/app.asar"), true);
        }
      });
      return;
    }
    case "linux": {
      let appLocation = "/usr/local/share/xanite/resources/app.asar";
      if (!fs.existsSync(appLocation)) {
        appLocation = "/usr/share/xanite/resources/app.asar";
      }
      process.nextTick(() => {
        callback(appLocation, true);
      });
      return;
    }
  }

  process.nextTick(() => {
    callback(null, false);
  });
}
