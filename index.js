#!/usr/bin/env node
(function () {
	'use strict';

	// load shortcuts file
	var shortcuts = require('./shortcuts.js').load();

	// process command line arguments sequentially to arrive at a final target path
	var finalPath = process.argv.slice(2).reduce(function (cwd, shortcut) {
		return shortcuts.lookup(cwd, shortcut);
	}, process.cwd());

	// print it
	console.log(finalPath);
})();
