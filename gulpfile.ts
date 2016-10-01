'use strict';

import gulp = require('gulp');
import typescript = require('gulp-typescript');

const project = typescript.createProject('tsconfig.json');

gulp.task('compile:typescript', () => {
	const result = project.src()
				.pipe(project());
	return result.js.pipe(gulp.dest('lib'));
});
