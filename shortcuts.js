/* globals module,require */
(function () {
	'use strict';

	var fs = require('fs');
	var os = require('os');
	var path = require('path');

	var RELATIVE_MARKER = path.sep + '*';
	var SHORTCUT_TARGET_SEPARATOR = ':';
	var SHORTCUTS_FILE = '.shortcuts';

	var Shortcuts = function (shortcutsFilePath) {
		if (typeof shortcutsFilePath === 'undefined') {
			shortcutsFilePath = path.join(os.homedir(), SHORTCUTS_FILE);
		}

		this.shortcutsFilePath = shortcutsFilePath;
		this.shortcuts = loadEntries(this.shortcutsFilePath);
	};

	Shortcuts.prototype.lookup = function (cwd, shortcutOrPath) {
		if (pathExists(shortcutOrPath)) return shortcutOrPath;
		if (pathExists(path.join(cwd, shortcutOrPath))) return path.join(cwd, shortcutOrPath);

		var target = this.shortcuts[shortcutOrPath];
		if (!target) return shortcutOrPath;

		// is the target a real path? if so, we're done
		if (pathExists(target)) return target;

		// otherwise try to expand it using other shortcuts
		return expand(cwd, this.shortcuts, target);
	};

	Shortcuts.prototype.add = function (newShortcut, newTarget) {
		this.shortcuts[newShortcut] = newTarget;

		// clear file
		fs.closeSync(fs.openSync(this.shortcutsFilePath, 'w'));

		// add all again
		for (var shortcut in this.shortcuts) {
			var target = this.shortcuts[shortcut];
			var entry = [shortcut, target].join(SHORTCUT_TARGET_SEPARATOR);
			fs.appendFileSync(this.shortcutsFilePath, entry + '\n');
		}
	}

	function ensureFile(filepath) {
		if (!pathExists(filepath)) {
			fs.closeSync(fs.openSync(filepath, 'w'));
		}
	}

	function readLines(filepath) {
		try {
			ensureFile(filepath);

			var fileContents = fs.readFileSync(filepath).toString();

			// handle both windows and linux line endings
			return fileContents.split('\n').map(function (line) {
				return line.trim();
			});
		} catch (er) {
			console.error('Failed to read shortcuts file (' + filepath + ')');
			return [];
		}
	}

	function pathExists(path) {
		try {
			var stat = fs.statSync(path);
			return stat.isFile() || stat.isDirectory();
		} catch (er) {
			if (er.code === 'ENOENT') {
				return false;
			} else {
				throw er;
			}
		}
	}

	function loadEntries(shortcutsFilePath) {
		var entries = readLines(shortcutsFilePath);

		return entries.reduce(function (map, entry) {
			if (entry.trim().length === 0) return map;

			// entry is <shortcut>:<target>, target may contain additional ':'
			var parts = entry.split(':');
			var shortcut = parts[0];
			var target = parts.splice(1).join(':');

			// store and return for next reduce
			map[shortcut] = target;
			return map;
		}, {});
	}

	// The idea is to find a target relative to the current working directory
	// so that e.g.
	//		/some/relative/*/x
	//	expands to
	//		/some/relative/project-1/x
	//	if cwd is /some/relative/project-1/some/path, and
	//		/some/relative/project-2/x
	//	if cwd is /some/relative/project-2/some/path
	function expandRelative(cwd, relativePath) {
		// are we dealing with a relative path?
		var relativeBaseEnds = relativePath.indexOf(RELATIVE_MARKER);

		// if not, return it as it is
		if (relativeBaseEnds === -1) return relativePath;

		// otherwise, we check if the CWD shares base with the relative path
		var relativeBase = relativePath.substring(0, relativeBaseEnds);
		if (cwd.indexOf(relativeBase) === -1) return relativePath;

		// we need to know what '*' is for the current CWD, i.e.
		// the first folder below <relative base>
		var cwdRoot = cwd.substring(relativeBase.length).split(path.sep)[1];
		if (typeof cwdRoot === 'undefined') return relativeBase;

		// to complete the path, we also need the relative target
		var relativeTarget = relativePath.substring(relativeBaseEnds + RELATIVE_MARKER.length + 1);
		return path.join(relativeBase, cwdRoot, relativeTarget);
	}

	function expandShortcuts(cwd, shortcuts, target) {
		// otherwise we try to expand it using other shortcut keys
		var expandedParts = target.split(path.sep).map(function (part) {
			// is this a shortcut reference, <key>?
			if (part.match(/<.*>/)) {
				// if so return the shortcuts expansion
				var key = part.substring(1, part.length - 1);
				var expanded = shortcuts[key];

				// possibly expanded recursively
				return expand(cwd, shortcuts, expanded);
			}

			// otherwise return unchanged
			return part;
		});

		return expandedParts.join(path.sep);
	}

	function expand(cwd, shortcuts, target) {
		// if target is a valid path => ok!
		if (pathExists(target)) return target;

		// otherwise expand using other shortcuts
		var expandedTarget = expandShortcuts(cwd, shortcuts, target);

		// ...and cwd
		return expandRelative(cwd, expandedTarget);
	}

	module.exports = Shortcuts;
})();