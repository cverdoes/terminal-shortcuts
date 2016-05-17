/* globals exports, process, require */

var Shortcuts = require('../main/shortcuts.js');
var path = require('path');
var testPath = path.join('src', 'test');

function tmpFile (index) {
	'use strict';

	return path.join(testPath, '.shortcuts-' + index + '.tmp');
}

exports.testNoShortcuts = function (test) {
	'use strict';

	var shortcuts = Shortcuts.load(tmpFile(1));

	test.expect(1);
	test.equals('bogus', shortcuts.lookup(process.cwd(), 'bogus'));

	test.done();
};

exports.testAddShortcut = function (test) {
	'use strict';

	var shortcuts = Shortcuts.load(tmpFile(2));

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

	var shortcuts = Shortcuts.load(tmpFile(3));

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

	var shortcuts = Shortcuts.load(tmpFile(4));
	var cwd = process.cwd();

	test.expect(2);

	// make sure shortcuts can be used to define other shortcut targets
	var part1 = '/some/dummy';
	shortcuts.add('a', part1);
	var part2 = '/path';
	shortcuts.add('b', '<a>' + part2);
	test.equals(part1 + part2, shortcuts.lookup(cwd, 'b'));

	// make sure wildcard match against cwd works
	shortcuts.add('c', path.join(cwd, '..', '*', 'src'));
	test.equals(path.join(cwd, 'src'), shortcuts.lookup(cwd, 'c'));

	test.done();
};
