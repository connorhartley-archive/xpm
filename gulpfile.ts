"use strict";

import gulp = require("gulp");
import typescript = require("gulp-typescript");

const project = typescript.createProject("tsconfig.json");

gulp.task("compile:typescript", () => {
  let result = project.src()
        .pipe(typescript(project));
  return result.js.pipe(gulp.dest("lib"));
});
