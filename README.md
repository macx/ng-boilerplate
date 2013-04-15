# [ngBoilerplate](http://joshdmiller.github.com/ng-boilerplate) [![Build Status](https://travis-ci.org/neoskop/ng-boilerplate.png?branch=master)](https://travis-ci.org/neoskop/ng-boilerplate)

An opinionated kickstarter for [AngularJS](http://angularjs.org) projects.

This Project is forked from [Josh Millers ngBoilerplate](http://joshdmiller.github.com/ng-boilerplate)
and was customized for [Neoksop GmbH](http://neoskop.de/).
***

## Quick Start

### Installation

Following global Tools are needed, if you do not have them already:

```sh
$ npm install -g grunt-cli
$ npm install -g karma
$ npm install -g bower
```

Clone the repository and install all dependencies:

```sh
$ git clone git@github.com:neoskop/ng-boilerplate.git 
$ cd ng-boilerplate
$ npm install # bower install will be done by grunt-bowerful
```

For develop within this project you need [Grunt](http://gruntjs.com), the following Tasks are available:

```sh
$ grunt       # actually this builds the project
$ grunt watch # this task waits for file changes and rebuilds the project
```

### Testing (Unit, E2E, Midway)

All Test are located in the `test` folder and Test-Runner for this project is 
[Karma](http://karma-runner.github.io/).

```sh
$ karma start # starts watching filechanges and runs trough all test
$ karma run   # if you want to run tests manually (without watch changes)
```

## ng-boilerplate in depth

### Structure
```
ng-boilerplate/
  |- src/
  |  |- app/
  |  |  |- <app logic>
  |  |- assets/
  |  |  |- <static files>
  |  |- components/
  |  |  |- <reusable code & external libs>
  |  |- sass/
  |  |  |- <sass as preprocessor for css>
  |- vendor/
  |  |- <bower components>
  |- test/
  |  | - <test written in jasmine>
  |- Gruntfile.js
  |- module.prefix
  |- module.suffix
  |- package.json
```
What follows is a brief description of each entry, but all directories contain
their own `README.md` file with additional documentation, so browse around to
learn more.

- `build/` - custom scripts for Grunt.
- `src/` - our application sources. [Read more &raquo;](src/README.md)
- `test` - test configuration.
- `vendor` - files needed to make everything happen, but *not* libraries our
  application uses. [Read more &raquo;](vendor/README.md)
- `Gruntfile.js` - our build script; see "The Build System" below.
- `module.prefix` and `module.suffix` - our compiled application script is
  wrapped in these, which by default are used to place the application inside a
  self-executing anonymous function to ensure no clashes with other libraries.
- `package.json` - metadata about the app, used by NPM and our build script.

### The Build System (Grunt Tasks)

The best way to learn about the build system is by familiarizing yourself with
[Grunt](http://gruntjs.com) and then reading through the heavily documented build
script, `Gruntfile.js`. But what follows in this section is a quick introduction to 
the tasks provided.

The driver of the process is the `delta` multi-task, which watches for file
changes using `grunt-contrib-watch` and executes one of seven tasks when a file
changes:

* `delta:gruntfile` - When `Gruntfile.js` changes, this task runs the linter
  (`jshint`) on that one file.
* `delta:assets` - When any file within `src/assets/` changes, all asset files
  are copied to `dist/assets/`.
* `delta:html` - When `src/index.html`, it is compiled as a Grunt template, so
  script names, etc., are dynamically replaced with the correct values from
  `package.json`.
* `delta:sass` - When any `*.sass` file within `src/` changes, all
  `src/sass/**/*.scss` files will be compiled, and compressed into
  `dist/assets/ng-boilerplate.css`.
* `delta:src` - When any JavaScript file within `src/` that does not end in
  `.spec.js` changes, all JavaScript sources are linted, all unit tests are run,
  and the previously-compiled templates are concatenated with them to form the
  final JavaScript source file (`dist/assets/ng-boilerplate.js`).
* `delta:tpls` - When any `*.tpl.html` file within `src/` changes, all templates
  are put into strings in a JavaScript file (technically two, one for
  `src/components/` and another for `src/app/`) that will add the template to
  AngularJS's
  [`$templateCache`](http://docs.angularjs.org/api/ng.$templateCache) so
  template files are part of the initial JavaScript payload and do not require
  any future XHR.  The template cache files are then concatenated with the rest
  of the scripts into the final JavaScript source file
  (`dist/assets/ng-boilerplate.js`).
