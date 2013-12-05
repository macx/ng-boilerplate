'use strict';
/* jslint camelcase: false */

/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
  * The `build_dir` folder is where our projects are compiled during
  * development and the `compile_dir` folder is where our app resides once it's
  * completely built.
  *
  * In addition to that, we have a `sass_dir` where all our sass files waiting
  * for their pre-compilation. We also pulled out all test file from `src` and
  * put'em in their own directory `test`.
  */
  build_dir: 'build',
  compile_dir: 'bin',
  sass_dir: 'src/scss',
  test_dir: 'test',

  app_base: 'src/app',
  common_base: 'src/common',

  default_tpl_pattern: '**/*.tpl.html',

  themes: ['tecalor'],

  /*
  * This is a collection of file patterns that refer to our app code (the
  * stuff in `src/`). These file paths are used in the configuration of
  * build tasks. `js` is all project javascript, less tests. `ctpl` contains
  * our reusable components' (`src/common`) template HTML files, while
  * `atpl` contains the same, but for our app's code. `html` is just our
  * main HTML file, `scss` is our main stylesheet, and `unit`, `midway` as
  * well as `e2e` contains our app's unit tests.
  */
  app_files: {
    js: ['src/**/*.js', '!src/**/*.spec.js'],
    jsunit: ['<%= test_dir %>/unit/**/*.spec.js'],
    jsmidway: ['<%= test_dir %>/midway/**/*.spec.js'],
    jse2e: ['<%= test_dir %>/e2e/**/*.spec.js'],

    coffee: ['src/**/*.coffee', '!src/**/*.spec.coffee'],
    coffeeunit: ['<%= test_dir %>/unit/**/*.spec.coffee'],
    coffeemidway: ['<%= test_dir %>/midway/**/*.spec.coffee'],
    coffeee2e: ['<%= test_dir %>/e2e/**/*.spec.coffee'],

    atpl: ['<%= app_base %>/<%= default_tpl_pattern %>'],
    ctpl: ['<%= common_base %>/<%= default_tpl_pattern %>'],

    html: ['src/index.html'],
    scss: ['<%= sass_dir %>/**/*.scss']
  },

  /**
  * This is the same as `app_files`, except it contains patterns that
  * reference vendor code (`vendor/`) that we need to place into the build
  * process somewhere. While the `app_files` property ensures all
  * standardized files are collected for compilation, it is the user's job
  * to ensure non-standardized (i.e. vendor-related) files are handled
  * appropriately in `vendor_files.js`.
  *
  * The `vendor_files.js` property holds files to be automatically
  * concatenated and minified with our project source files.
  *
  * The `vendor_files.css` property holds any CSS files to be automatically
  * included in our app.
  */
  vendor_files: {
    js: [
      'vendor/angular/angular.js',
      'vendor/angular-ui-router/release/angular-ui-router.js'
    ],
    css: [
      'vendor/normalize-css/normalize.css'
    ],
    /*tecalor: {
      js: [],
      css: [
        'vendor/normalize-css/normalize.css'
      ]
    }*/
  }
};
