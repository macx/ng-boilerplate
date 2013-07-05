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
  }
};
