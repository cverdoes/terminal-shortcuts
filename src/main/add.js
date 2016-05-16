#!/usr/bin/env node
(function () {
	'use strict';

	// first argument is the shortcut
	var shortcut = process.argv[2];

	// second argument, if supplied is the target,
	// otherwise fallback to cwd
	var target = process.argv[3] || process.cwd();

	require('./shortcuts.js')
		.load()
		.add(shortcut, target);

})();
