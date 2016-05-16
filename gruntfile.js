/* globals module */

module.exports = function (grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		clean: ['test/*.tmp'],

		nodeunit: ['test/*.js'],

		// Detect JavaScript errors and enforce coding conventions.
		jshint: {
			src: ['*.js'],
			options: { jshintrc: '.jshintrc' }
		},

		// Check JavaScript coding style
		jscs: {
			src: ['*.js'],
			options: { config: '.jscsrc' }
		}
	});

	// plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jscs');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Default task(s).
	grunt.registerTask('test', ['clean', 'nodeunit']);
	grunt.registerTask('default', ['test', 'jshint', 'jscs']);

};
