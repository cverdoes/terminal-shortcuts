/* globals module */

module.exports = function (grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

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

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'jscs']);

};
