#!/usr/bin/env node
(function () {
	'use strict';

	var Shortcuts = require('./shortcuts.js');

	// load shortcuts file
	var shortcuts = new Shortcuts();

	// process command line arguments sequentially to arrive at a final target path
	var finalPath = process.argv.slice(2).reduce(function (cwd, shortcut) {
		return shortcuts.lookup(cwd, shortcut);
	}, process.cwd());

	// print it
	console.log(finalPath);
})();
