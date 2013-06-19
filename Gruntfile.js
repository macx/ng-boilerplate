'use strict';

/**
 * Setting livereload port, lrSnippet and a mount function for later
 * connect-livereload integration.
 */
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install --save-dev` in this directory.
   */
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

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
    test_dir: 'test'

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
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n'
    },

    /**
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
      atpl: ['src/app/**/*.tpl.html'],
      ctpl: ['src/common/**/*.tpl.html'],
      html: ['src/index.html'],
      scss: ['<%= sass_dir %>/**/*.scss'],
      unit: ['<%= test_dir %>/unit/**/*.spec.js'],
      midway: ['<%= test_dir %>/midway/**/*.spec.js'],
      e2e: ['<%= test_dir %>/e2e/**/*.spec.js']
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
        'vendor/angular/angular.js'
      ],
      css: [
      ]
    },

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: [
      '<%= build_dir %>',
      '<%= compile_dir %>'
    ],

    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and javascripts into
     * `build_dir`, and then to copy the assets to `compile_dir`.
     */
    copy: {
      build_assets: {
        files: [
          {
            src: ['**', '!README.md'],
            dest: '<%= build_dir %>/assets/',
            cwd: 'src/assets',
            expand: true
          }
       ]
      },
      build_appjs: {
        files: [
          {
            src: [ '<%= app_files.js %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_vendorjs: {
        files: [
          {
            src: [ '<%= vendor_files.js %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      compile_assets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= compile_dir %>/assets',
            cwd: '<%= build_dir %>/assets',
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
       * The `compile_dir` target is the concatenation of our application source code
       * into a single file. All files matching what's in the `src.js`
       * configuration property above will be included in the final build.
       *
       * In addition, the source is surrounded in the blocks specified in the
       * `module.prefix` and `module.suffix` files, which are just run blocks
       * to ensure nothing pollutes the global namespace.
       *
       * The `options` array allows us to specify some customization for this
       * operation. In this case, we are adding a banner to the top of the file,
       * based on the above definition of `meta.banner`. This is simply a
       * comment with copyright information.
       */
      compile_js: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: [
          '<%= vendor_files.js %>',
          'module.prefix',
          '<%= build_dir %>/src/**/*.js',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          '<%= vendor_files.js %>',
          'module.suffix'
        ],
        dest: '<%= compile_dir %>/<%= pkg.name %>.js'
      }
    },

    /**
     * `ng-min` annotates the sources before minifying. That is, it allows us
     * to code without the array syntax.
     */
    ngmin: {
      compile: {
        files: [
          {
            src: [ '<%= app_files.js %>' ],
            cwd: '<%= build_dir %>',
            dest: '<%= build_dir %>',
            expand: true
          }
        ]
      }
    },

    ngdocs: {
      /**
       * Basic ngdocs configuration. Contains a temporary `site_tmp` folder which
       * gets later committed to gh-pages branch. The nav-template modifies the standard
       * ngdocs navigation template to add additional markup for example.
       *
       * html5Mode controls if pushState is active or not. We set this to `false` by default
       * to make sure the generated site works well on github pages without routing
       * problems.
       *
       * `styles` let you manipulate the basic styles that come with ngdocs, we made
       * the font-sizes in particular cases a bit smaller so that everything looks
       * nice.
       *
       * `api`, `guide` and `tutorial` configure the certain sections. You could either
       * declare some source files as `src` which contain ngdoc comments, or simply
       * *.ngdoc files which also get interpreted as ngdoc files.
       */
      options: {
        dest: 'site_tmp',
        title: grunt.file.readJSON('bower.json').name,
        navTemplate: 'docs/html/navigation.html',
        html5Mode: false,
        startPage: '/guide',
        styles: ['docs/css/styles.css']
      },

      /*
       * API section configuration. Defines source files and a section title.
       */
      api: {
        src: ['<%= src.js %>', 'docs/content/api/*.ngdoc'],
        title: 'API Reference'
      },

      /*
       * Guide section configuration. Defines source files and a section title.
       */
      guide: {
        src: ['docs/content/guide/*.ngdoc'],
        title: 'Guide'
      },
      /*
       * Tutorial section configuration. Defines source files and a section title.
       */
      tutorial: {
        src: ['docs/content/tutorial/*.ngdoc'],
        title: 'Tutorial'
      }
    },

    /**
     * Minify the sources!
     */
    uglify: {
      compile: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
        }
      }
    },

    /**
     * use grunt-compass for sass with compass compiling
     */
    compass: {
      compile: {
        options: {
          sassDir: '<%= sass_dir %>',
          cssDir: '<%= build_dir %>/assets/',
          debugInfo: true
        }
      }
    },

    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside `src/`.
     */
    jshint: {
      src: [
        '<%= app_files.js %>'
      ],
      test: [
        '<%= app_files.unit %>',
        '<%= app_files.midway %>',
        '<%= app_files.e2e %>'
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
     * connect-server instance, by default lisiting to port 9000
     */
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet, mountFolder(connect, '<%= build_dir %>')
            ];
          }
        }
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
        options: {
          base: 'src/app'
        },
        src: [ '<%= app_files.atpl %>' ],
        dest: '<%= build_dir %>/templates-app.js'
      },

      /**
       * These are the templates from `src/components`.
       */
      common: {
        options: {
          base: 'src/common',
        },
        src: ['<%= app_files.ctpl %>'],
        dest: '<%= build_dir %>/templates-common.js'
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
        singleRun: true,
        runnerPort: 9101,
        background: true
      }
    },

    /**
     * The `index` task compiles the `index.html` file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    index: {

      /**
       * During development, we don't want to have wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the `<head>` of `index.html`. The
       * `src` property contains the list of included files.
       */
      build: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= app_files.js %>',
          '<%= html2js.common.dest %>',
          '<%= html2js.app.dest %>',
          '<%= vendor_files.css %>',
        ]
      },

      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we're back!
       */
      compile: {
        dir: '<%= compile_dir %>',
        src: [
          '<%= concat.compile_js.dest %>',
          '<%= vendor_files.css %>',
        ]
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
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true
      },

      /**
       * When the Gruntfile changes, we just want to lint it. In fact, when
       * your Gruntfile changes, it will automatically be reloaded!
       */
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile']
      },

      /**
       * When our source files change, we want to lint them and run our
       * unit tests.
       */
      src: {
        files: [
          '<%= app_files.js %>'
        ],
        tasks: [ 'jshint:src', 'karma:unit:run', 'copy:build_appjs' ]
      },

      /**
       * When SCSS files changes, we need to compile them to css
       */
      sass: {
        files: [
          '<%= app_files.scss %>'
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
        tasks: [ 'copy:build_assets' ]
      },

      /**
       * When index.html changes, we need to compile it.
       */
      html: {
        files: [ '<%= app_files.html %>' ],
        tasks: [ 'index:build' ]
      },

      /**
       * When our templates change, we only rewrite the template cache.
       */
      tpls: {
        files: [
          '<%= app_files.atpl %>',
          '<%= app_files.ctpl %>'
        ],
        tasks: [ 'html2js' ]
      },

      /**
       * When a unit test file changes, we only want to linit it and run the
       * unit tests. However, since the `app` module requires the compiled
       * templates, we must also run the `html2js` task.
       */
      karma: {
        files: [
          '<%= app_files.unit %>',
          '<%= app_files.midway %>',
          '<%= app_files.e2e %>'
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
  grunt.registerTask('watch', ['default', 'connect:livereload', 'delta']);

  /**
   * The default task is to build and compile.
   */
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['quick-build', 'compass']);

  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask('quick-build', [
    'clean', 'html2js', 'jshint', 'karma:unit', 'copy:build_assets', 
    'copy:build_appjs', 'copy:build_vendorjs', 'index:build'
  ]);

  /**
   * The `compile` task gets your app ready for deployment by concatenating and
   * minifying your code.
   */
  grunt.registerTask( 'compile', [
    'copy:compile_assets', 'ngmin', 'concat', 'uglify', 'index:compile'
  ]);

  grunt.registerTask('release', ['changelog']);

  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask('index', 'Process index.html template', function () {
    var dirRE = new RegExp('^('+grunt.config('build_dir')+'|'+grunt.config('compile_dir')+')\/', 'g' );

    var jsFiles = this.filesSrc.filter(function (file) {
      return file.match( /\.js$/ );
    }).map( function (file) {
      return file.replace(dirRE,'');
    });

    var cssFiles = this.filesSrc.filter(function (file) {
      return file.match(/\.css$/);
    }).map( function (file) {
      return file.replace(dirRE,'');
    });

    grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
      process: function (contents, path) {
        return grunt.template.process(contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles
          }
        });
      }
    });
  });

};
