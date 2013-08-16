'use strict';
/* jslint camelcase: false */


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
   * Load in our build configuration file.
   */
  var userConfig = require('./build.config.js');

  /**
   * Load user custom grunt task definitions
   */
  var userTasks = require('./build.tasks.js');

  /**
   * This is the configuration object Grunt uses to give each plugin its
   * instructions.
   */
  var taskConfig = {
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
     * Creates a changelog on a new version.
     */
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        template: 'changelog.tpl'
      }
    },

    /**
     * Increments the version number, etc.
     */
    bump: {
      options: {
        files: [
          'package.json',
          'bower.json'
        ],
        commit: false,
        commitMessage: 'chore(release): v%VERSION%',
        commitFiles: [
          'package.json',
          'bower.json'
        ],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin'
      }
    },

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: ['<%= build_dir %>', '<%= compile_dir %>'],

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

      build_vendorcss: {
        files: [
          {
            src: ['<%= vendor_files.css %>'],
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
          'module.suffix'
        ],
        dest: '<%= compile_dir %>/assets/js/<%= pkg.name %>.js'
      }
    },

    /**
     * `grunt coffee` compiles the CoffeeScript sources. To work well with the
     * rest of the build, we have a separate compilation task for sources and
     * specs so they can go to different places. For example, we need the
     * sources to live with the rest of the copied JavaScript so we can include
     * it in the final build, but we don't want to include our specs there.
     */
    coffee: {
      source: {
        options: {
          bare: true
        },
        expand: true,
        cwd: '.',
        src: [ '<%= app_files.coffee %>' ],
        dest: '<%= build_dir %>',
        ext: '.js'
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
        src: ['<%= app_files.js %>', 'docs/content/api/*.ngdoc'],
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
     * use grunt-contrib-compass for sass with compass compiling
     */
    compass: {
      build: {
        options: {
          sassDir: '<%= sass_dir %>',
          cssDir: '<%= build_dir %>/assets/css',
          debugInfo: true
        }
      }
    },

    /**
     * Exlicitly minify css code, since grunt-contrib-compass does not come with
     * built-in minification support. This task will be executed **after** scss
     * files have been compiled.
     */
    cssmin: {
      compile: {
        options: {
          banner: '<%= meta.banner %>',
          report: 'gzip'
        },
        files: {
          '<%= compass.build.options.cssDir %>/main.css': [
            '<%= vendor_files.css %>',
            '<%= compass.build.options.cssDir %>/main.css'
          ]
        }
      }
    },

    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our tests
     * are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside `src/`.
     */
    jshint: {

      options: {
        jshintrc: '.jshintrc'
      },

      src: {
        files: {
          src: ['<%= app_files.js %>']
        }
      },

      test: {
        files: {
          src: [
            '<%= app_files.jsunit %>',
            '<%= app_files.jsmidway %>',
            '<%= app_files.jse2e %>'
          ]
        }
      },

      gruntfile: {
        files: {
          src: ['Gruntfile.js']
        }
      },

      buildconf: {
        files: {
          src: ['build.config.js']
        }
      },

      buildtasks: {
        files: {
          src: ['build.tasks.js']
        }
      }
    },

    /**
     * connect-server instance, by default lisiting to port 9000
     */
    connect: {
      /**
       * Testserver instance for e2e tests. This is a work in progress since
       * we're still having problems with the e2e test environment.
       */
      testserver: {
        options: {
          base: '<%= build_dir %>'
        }
      },

      livereload: {
        options: {
          port: 9000,
          // change this to '0.0.0.0' to access the server from outside
          hostname: '*',
          middleware: function (connect) {
            return [lrSnippet, mountFolder(connect, 'build')];
          }
        }
      }
    },

    /**
     * `coffeelint` does the same as `jshint`, but for CoffeeScript.
     * CoffeeScript is not the default in ngBoilerplate, so we're just using
     * the defaults here.
     */
    coffeelint: {
      src: {
        files: {
          src: [ '<%= app_files.coffee %>' ]
        }
      },
      test: {
        files: {
          src: [
            '<%= app_files.coffeeunit %>',
            '<%= app_files.coffeemidway %>',
            '<%= app_files.coffeee2e %>'
          ]
        }
      }
    },

    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become
     * part of the initial payload as one JavaScript file. Neat!
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
       * These are the templates from `src/common`.
       */
      common: {
        options: {
          base: 'src/common'
        },
        src: ['<%= app_files.ctpl %>'],
        dest: '<%= build_dir %>/templates-common.js'
      }
    },

    /**
     * The Karma configurations.
     */
    karma: {
      unit: {
        options: {
          configFile: '<%= build_dir %>/karma.unit.conf.js'
        },
        runnerPort: 9102,
        background: true
      },

      midway: {
        options: {
          configFile: '<%= build_dir %>/karma.midway.conf.js'
        },
        runnerPort: 9103,
        background: true
      },

      e2e: {
        options: {
          configFile: '<%= build_dir %>/karma.e2e.conf.js'
        },
        runnerPort: 9105,
        background: true
      },

      continuous_unit: {
        options: {
          configFile: '<%= build_dir %>/karma.unit.conf.js'
        },
        singleRun: true
      },

      continuous_midway: {
        options: {
          configFile: '<%= build_dir %>/karma.midway.conf.js'
        },
        singleRun: true
      },

      continuous_e2e: {
        options: {
          configFile: '<%= build_dir %>/karma.e2e.conf.js'
        },
        singleRun: true
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
          '<%= build_dir %>/src/**/*.js',
          '<%= html2js.common.dest %>',
          '<%= html2js.app.dest %>',
          '<%= vendor_files.css %>',
          '<%= compass.build.options.cssDir %>/**/*.css'
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
          '<%= compile_dir %>/assets/css/main.css'
        ]
      }
    },

    /**
     * This task compiles the karma template so that changes to its file array
     * don't have to be managed manually.
     */
    karmaconfig: {

      unit: {
        dir: '<%= build_dir %>',
        destFile: 'karma.unit.conf.js',
        tplFile: 'karma/karma.unit.tpl.js',
        src: [
          '<%= vendor_files.js %>',
          'vendor/angular-mocks/angular-mocks.js',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>'
        ]
      },

      midway: {
        dir: '<%= build_dir %>',
        destFile: 'karma.midway.conf.js',
        tplFile: 'karma/karma.midway.tpl.js',
        src: [
          '<%= vendor_files.js %>',
          'vendor/ngMidwayTester/Source/ngMidwayTester.js',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>'
        ]
      },

      e2e: {
        dir: '<%= build_dir %>',
        destFile: 'karma.e2e.conf.js',
        tplFile: 'karma/karma.e2e.tpl.js',
        src: [
          '<%= vendor_files.js %>',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>'
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
        tasks: ['jshint:gruntfile'],
        options: {
          livereload: false
        }
      },

      /**
       * When the build.conf.js changes, we just want to lint it. In fact, when
       */
      buildconf: {
        files: 'build.config.js',
        tasks: ['jshint:buildconf'],
        options: {
          livereload: false
        }
      },

      /**
       * When the build.task.conf changes, we just want to lint it. In fact, when
       */
      buildtasks: {
        files: 'build.tasks.js',
        tasks: ['jshint:buildtasks'],
        options: {
          livereload: false
        }
      },

      /**
       * When our source files change, we want to lint them and run our
       * unit tests.
       */
      jssrc: {
        files: [
          '<%= app_files.js %>'
        ],
        tasks: ['jshint:src', 'karma:unit:run', 'karma:midway:run', 'karma:e2e:run', 'copy:build_appjs']
      },

      /**
       * When our CoffeeScript source files change, we want to run lint them and
       * run our unit tests.
       */
      coffeesrc: {
        files: [
          '<%= app_files.coffee %>'
        ],
        tasks: [ 'coffeelint:src', 'coffee:source', 'karma:unit:run', 'karma:midway:run', 'karma:e2e:run', 'copy:build_appjs' ]
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
       * When a JavaScript test file changes, we only want to lint it and
       * run the tests. We don't want to do any live reloading.
       */
      jsunit: {
        files: [
          '<%= app_files.jsunit %>'
        ],
        tasks: [ 'jshint:test', 'karma:unit:run' ],
        options: {
          livereload: false
        }
      },

      jsmidway: {
        files: [
          '<%= app_files.jsmidway %>'
        ],
        tasks: [ 'jshint:test', 'karma:midway:run' ],
        options: {
          livereload: false
        }
      },

      jse2e: {
        files: [
          '<%= app_files.jse2e %>'
        ],
        tasks: [ 'jshint:test', 'karma:e2e:run' ],
        options: {
          livereload: false
        }
      },

      /**
       * When a CoffeeScript test file changes, we only want to lint it and
       * run the unit tests. We don't want to do any live reloading.
       */
      coffeeunit: {
        files: [
          '<%= app_files.coffeeunit %>'
        ],
        tasks: [ 'coffeelint:test', 'karma:unit:run' ],
        options: {
          livereload: false
        }
      },

      coffeemidway: {
        files: [
          '<%= app_files.coffeemidway %>'
        ],
        tasks: [ 'coffeelint:test', 'karma:midway:run' ],
        options: {
          livereload: false
        }
      },

      coffeee2e: {
        files: [
          '<%= app_files.coffeee2e %>'
        ],
        tasks: [ 'coffeelint:test', 'karma:e2e:run' ],
        options: {
          livereload: false
        }
      }
    }
  };

  var defaultTasks = {
    watch: {
      name: 'watch',
      description: '',
      definition: ['build', 'karma:unit', 'karma:midway', 'karma:e2e', 'connect:livereload', 'delta']
    },

    /**
    * The default task is to build and compile.
    */
    defaultTask: {
      name: 'default',
      definition: ['build', 'compile']
    },

    /**
    * The `build` task gets your app ready to run for development and testing.
    */
    build: {
      name: 'build',
      definition: [
        'clean',
        'html2js',
        'jshint',
        'coffeelint',
        'coffee',
        'compass:build',
        'copy:build_assets',
        'copy:build_appjs',
        'copy:build_vendorjs',
        'copy:build_vendorcss',
        'index:build',
        'karmaconfig',
        'karma:continuous_unit',
        'karma:continuous_midway',
        'connect:testserver',
        'karma:continuous_e2e'
      ]
    },

    /**
     * quick-build task which gets executed by travis. We have to decouple this one
     * from build task, because travis ci can't handle compass/sass etc.
     */
    quickBuild: {
      name: 'quick-build',
      definition: [
        'clean',
        'html2js',
        'jshint',
        'coffeelint',
        'coffee',
        'karmaconfig'
      ]
    },

    /**
    * The `compile` task gets your app ready for deployment by concatenating and
    * minifying your code.
    */
    compile: {
      name: 'compile',
      definition: [
        'cssmin:compile',
        'copy:compile_assets',
        'ngmin',
        'concat:compile_js',
        'uglify',
        'index:compile'
      ]
    },

    release: {
      name: 'release',
      definition: ['changelog']
    }
  };

  grunt.initConfig(grunt.util._.merge(taskConfig, userConfig));

  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask('watch', 'delta');

  /**
   * Merging default tasks with user cusom tasks
   */
  var tasks = grunt.util._.merge(defaultTasks, userTasks);

  /**
   * Register tasks by task definitions.
   */
  grunt.util._.forEach(tasks, function (task) {

    var taskDefinition = (typeof task.definition === 'function') ? task.definition(grunt) : task.definition;

    if (task.description && task.description !== '') {
      grunt.registerTask(task.name, task.description, taskDefinition);
    } else {
      grunt.registerTask(task.name, taskDefinition);
    }
  });

  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS (files) {
    return files.filter(function (file) {
      return file.match(/\.js$/);
    });
  }

  /**
   * A utility function to get all app CSS sources.
   */
  function filterForCSS (files) {
    return files.filter(function (file) {
      return file.match(/\.css$/);
    });
  }


  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask('index', 'Process index.html template', function () {
    var dirRE = new RegExp('^('+grunt.config('build_dir')+'|'+grunt.config('compile_dir')+')\/', 'g');
    var jsFiles = filterForJS(this.filesSrc).map(function (file) {
      return file.replace(dirRE, '');
    });
    var cssFiles = filterForCSS(this.filesSrc).map(function (file) {
      return file.replace(dirRE, '');
    });

    grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
      process: function (contents) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config('pkg.version')
          }
        });
      }
    });
  });

  /**
   * In order to avoid having to specify manually the files needed for karma to
   * run, we use grunt to manage the list for us. The `karma/*` files are
   * compiled as grunt templates for use by Karma. Yay!
   */
  grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function () {
    var jsFiles = filterForJS(this.filesSrc);

    grunt.file.copy(this.data.tplFile, this.data.dir + '/' + this.data.destFile, {
      process: function (contents) {
        return grunt.template.process(contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });
  });

};
