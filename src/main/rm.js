#!/usr/bin/env node
(function () {
	'use strict';

	if (process.argv.length < 3) return;

	var shortcut = process.argv[2];

	require('./shortcuts.js')
		.load()
		.rm(shortcut);

})();
