'use strict';

module.exports = function (grunt) {
  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-bowerful');
  grunt.loadNpmTasks('grunt-conventional-changelog');

  /**
   * The `build` directory contains our custom Grunt tasks for using testacular
   * and compiling our templates into the cache. If we just tell Grunt about the
   * directory, it will load all the requisite JavaSript files for us.
   */

  /**
   * This is the configuration object Grunt uses to give each plugin its
   * instructions.
   */
  grunt.initConfig({
    /**
     * The directory to which we throw our compiled project files.
     */
    distdir: 'dist',

    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * The banner is the comment that is placed at the top of our compiled
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner:
        '/**\n' +
        ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n'
    },

    /**
     * This is a collection of file definitions we use in the configurations of
     * build tasks. `js` is all project javascript. `atpl` contains
     * our reusable components' template HTML files, while `ctpl` contains the
     * same, but for our app's code. `html` is just our main HTML file
     */
    src: {
      js: ['src/**/*.js', '!src/**/*.spec.js'],
      atpl: ['src/app/**/*.tpl.html'],
      ctpl: ['src/components/**/*.tpl.html'],
      tpljs: ['<%= distdir %>/tmp/**/*.js'],
      scss: ['src/scss/**/*.scss'],
      scssDir: ['src/scss'],
      html: ['src/index.html'],
      karma: ['test/**/*.spec.js']
    },

    /**
     * The directory to delete when `grunt clean` is executed.
     */
    clean: ['<%= distdir %>'],

    /**
     * `grunt copy` just copies files from A to B. We use it here to copy our
     * project assets (images, fonts, etc.) into our distribution directory.
     */
    copy: {
      assets: {
        files: [
          {
            src: ['**', '!README.md'],
            dest: '<%= distdir %>/assets/',
            cwd: 'src/assets',
            expand: true
          }
        ]
      }
    },

    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    concat: {
      /**
       * The `dist` target is the concatenation of our application source code
       * into a single file. All files matching what's in the `src.js`
       * configuration property above will be included in the final build.
       *
       * In addition, the source is surrounded in the blocks specified in the
       * `module.prefix` and `module.suffix` files, which are just run blocks
       * to ensure nothing pollutes the global scope.
       *
       * The `options` array allows us to specify some customization for this
       * operation. In this case, we are adding a banner to the top of the file,
       * based on the above definition of `meta.banner`. This is simply a
       * comment with copyright informaiton.
       */
      dist: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: ['module.prefix', '<%= src.js %>', '<%= src.tpljs %>', 'module.suffix'],
        dest: '<%= distdir %>/assets/<%= pkg.name %>.js'
      },

    },

    /**
     * The Bower(ful) Task installs/concats all components according to the
     * compontent.json (dependencies).
     */
    bowerful: {
      dist: {
        store: 'vendor',
        dest: '<%= distdir %>/assets',
        destfile: 'libs', // depends on components libs.css/libs.js
        packages: grunt.file.readJSON('bower.json').dependencies
      }
    },
    /**
     * Minify the sources!
     */
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        files: {
          '<%= distdir %>/assets/<%= pkg.name %>.min.js': ['<%= distdir %>/assets/<%= pkg.name %>.js']
        }
      }
    },

    /**
     * use grunt-compass for sass with compass compiling
     */
    compass: {
      dist: {
        options: {
          sassDir: '<%= src.scssDir %>',
          cssDir: '<%= distdir %>/assets/',
          debugInfo: true
        }
      }
    },
    /**
     * `jshint` defines the rules of our linter as well as which files we should
     * check. This file, all java script sources, and all our unit tests are
     * linted based on the policies listed in `options`. But we can allow
     * specify exclusionary patterns for external components by prefixing them
     * with an exclamation point (!).
     */
    jshint: {
      src: [
        'Gruntfile.js',
        '<%= src.js %>',
        // do we really need to lint this automated files?
        // '<%= src.tpljs %>',
        '<%= src.karma %>'
      ],
      karma: [
        '<%= src.karma %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        // we are using the .jshintrc file!
        jshintrc: '.jshintrc',
      }
    },

    /**
     * HTML2JS is a Grunt plugin originally written by the AngularUI Booststrap
     * team and updated to Grunt 0.4 by me. It takes all of your template files
     * and places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become part
     * of the initial payload as one JavaScript file. Neat!
     */
    html2js: {
      /**
       * These are the templates from `src/app`.
       */
      app: {
        src: ['<%= src.atpl %>'],
        base: 'src/app',
        dest: 'dist/tmp/app.templates.js'
      },

      /**
       * These are the templates from `src/components`.
       */
      component: {
        src: ['<%= src.ctpl %>'],
        base: 'src/components',
        dest: 'dist/tmp/component.templates.js'
      }
    },

    /**
     * Conventional Changelog Taks,
     * generating a changelog based on angularjs' commit convention
     */
    changelog: {
      options: {
        dest: 'CHANGELOG.md'
      }
    },

    /**
     * The Karma configurations.
     */
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files.
     */
    delta: {
      /**
       * When the Gruntfile changes, we just want to lint it. That said, the
       * watch will have to be restarted if it should take advantage of any of
       * the changes.
       */
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile']
      },

      /**
       * When our source files change, we want to run most of our build tasks
       * (excepting uglification).
       */
      src: {
        files: [
          '<%= src.js %>'
        ],
        tasks: ['jshint:src', 'concat:dist', 'uglify:dist']
      },

      /**
       * When SCSS files changes, we need to compile them to css
       */
      sass: {
        files: [
          '<%= src.scss %>'
        ],
        tasks: ['compass']
      },

      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      assets: {
        files: [
          'src/assets/**/*'
        ],
        tasks: ['copy']
      },

      /**
       * When index.html changes, we need to compile just it.
       */
      html: {
        files: ['<%= src.html %>'],
        tasks: ['index']
      },

      /**
       * When our templates change, we only add them to the template cache.
       */
      tpls: {
        files: [
          '<%= src.atpl %>',
          '<%= src.ctpl %>'
        ],
        tasks: ['html2js', 'concat:dist', 'uglify:dist']
      },

      /**
       * When a unit test file changes, we only want to linit it and run the
       * unit tests. However, since the `app` module requires the compiled
       * templates, we must also run the `html2js` task.
       */
      karma: {
        files: [
          '<%= src.karma %>'
        ],
        tasks: ['jshint:karma']
      }
    }
  });

  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask('watch', 'delta');
  grunt.registerTask('watch', ['default', 'delta']);

  /**
   * The default task is to build.
   */
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['quick-build', 'compass', 'karma']);

  /**
   * A task to build the project, without some of the slower processes. This is
   * used during development and testing and is part of the `watch`.
   */
  grunt.registerTask('quick-build', ['clean', 'html2js', 'jshint', 'concat', 'bowerful', 'index', 'copy']);

  grunt.registerTask('release', ['changelog']);

  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task compiles it.
   */
  grunt.registerTask('index', 'Process index.html template', function () {
    grunt.file.copy('src/index.html', 'dist/index.html', { process: grunt.template.process });
  });

};
