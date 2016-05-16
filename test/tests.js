/* globals exports, process, require */

var Shortcuts = require('../shortcuts.js');
var path = require('path');

exports.testNoShortcuts = function (test) {
	'use strict';

	var shortcuts = Shortcuts.load('test/.shortcuts-1.tmp');

	test.expect(1);
	test.equals('bogus', shortcuts.lookup(process.cwd(), 'bogus'));

	test.done();
};

exports.testAddShortcut = function (test) {
	'use strict';

	var shortcuts = Shortcuts.load('test/.shortcuts-2.tmp');

	test.expect(2);
	test.equals('bogus', shortcuts.lookup(process.cwd(), 'bogus'));

	var shortcut = 's';
	var target = '/some/dummy/path';
	shortcuts.add(shortcut, target);
	test.equals(target, shortcuts.lookup(process.cwd(), shortcut));

	test.done();
};

exports.testRmShortcut = function (test) {
	'use strict';

	var shortcuts = Shortcuts.load('test/.shortcuts-3.tmp');

	test.expect(2);

	var shortcut = 's';
	var target = '/some/dummy/path';
	shortcuts.add(shortcut, target);
	test.equals(target, shortcuts.lookup(process.cwd(), shortcut));

	shortcuts.rm(shortcut);
	test.equals(shortcut, shortcuts.lookup(process.cwd(), shortcut));

	test.done();
};

exports.testExpansion = function (test) {
	'use strict';

	var shortcuts = Shortcuts.load('test/.shortcuts-4.tmp');
	var cwd = process.cwd();

	test.expect(2);

	// make sure shortcuts can be used to define other shortcut targets
	var part1 = '/some/dummy';
	shortcuts.add('a', part1);
	var part2 = '/path';
	shortcuts.add('b', '<a>' + part2);
	test.equals(part1 + part2, shortcuts.lookup(cwd, 'b'));

	// make sure wildcard match against cwd works
	shortcuts.add('c', path.join(cwd, '..', '*', 'test'));
	test.equals(path.join(cwd, 'test'), shortcuts.lookup(cwd, 'c'));

	test.done();
};
