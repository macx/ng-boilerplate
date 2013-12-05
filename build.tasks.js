'use strict';

module.exports = {

  customTask: {
    name: 'custom',
    description: 'this is a custom task to show, how to write your own',
    definition: function (grunt) {
      return function () {
        console.dir(grunt);
      };
    }
  },

  /*defaultTaskWithTheme: {
    name: 'default',
    definition: ['build-with-theme:tecalor', 'compile']
  },

  watchTaskWithTheme: {
    name: 'watch',
    description: '',
    definition: [
      'build-with-theme:tecalor',
      'karma:unit',
      'karma:midway',
      'connect:livereload',
      'delta'
    ]
  },
  compileTaskWithTheme: {
    name: 'compile',
    definition: [
      'cssmin:compile_with_theme',
      'copy:compile_assets',
      'ngmin',
      'concat:compile_js_with_theme',
      'uglify',
      'index:compile'
    ]
  }*/
};
