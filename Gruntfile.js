module.exports = function (grunt) {
  // See http://www.jshint.com/docs/#strict
  "use strict";

  // Project configuration.
  grunt.initConfig({
    jasmine_node: {
      projectRoot: "."
    }
    , watch: {
      files: ['**/*.js']
      , tasks: ['default']
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jasmine_node']);

  // Travis-CI task
  grunt.registerTask('travis', ['default']);

};
