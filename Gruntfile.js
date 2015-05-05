/*!
 * Bootstrap's Gruntfile
 * http://getbootstrap.com
 * Copyright 2013-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

module.exports = function (grunt) {
  'use strict'

  // Force use of Unix newlines
  grunt.util.linefeed = '\n'

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
            ' */\n',
    jqueryCheck: 'if (typeof jQuery === \'undefined\') {\n' +
                 '  throw new Error(\'Bootstrap\\\'s JavaScript requires jQuery\')\n' +
                 '}\n',
    jqueryVersionCheck: '+function ($) {\n' +
                        '  var version = $.fn.jquery.split(\' \')[0].split(\'.\')\n' +
                        '  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {\n' +
                        '    throw new Error(\'Bootstrap\\\'s JavaScript requires jQuery version 1.9.1 or higher\')\n' +
                        '  }\n' +
                        '}(jQuery);\n\n',

    // Task configuration.
    clean: {
      dist: 'dist'
    },

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },
      core: {
        src: 'js/*.js'
      },
      test: {
        options: {
          jshintrc: 'js/tests/unit/.jshintrc'
        },
        src: 'js/tests/unit/*.js'
      }
    },

    jscs: {
      options: {
        config: 'js/.jscsrc'
      },
      core: {
        src: '<%= jshint.core.src %>'
      },
      test: {
        src: '<%= jshint.test.src %>'
      },
      assets: {
        options: {
          requireCamelCaseOrUpperCaseIdentifiers: null
        },
        src: '<%= jshint.assets.src %>'
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>\n<%= jqueryCheck %>\n<%= jqueryVersionCheck %>',
        stripBanners: false
      },
      bootstrap: {
        src: [
          'js/util.js',
          'js/alert.js',
          'js/button.js',
          'js/carousel.js',
          'js/collapse.js',
          'js/dropdown.js',
          'js/modal.js',
          'js/scrollspy.js',
          'js/tooltip.js',
          'js/popover.js',
          'js/tab.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    closureCompiler:  {

      options: {
        compilerFile: require('superstartup-closure-compiler').getPath(),
        checkModified: false,

        compilerOpts: {
           // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
           // jscomp_warning: 'reportUnknownTypes', someday - maybe we will get to 100% typed, this helps track those down
           compilation_level: 'ADVANCED_OPTIMIZATIONS',
           warning_level: 'verbose',
           summary_detail_level: 3,
           output_wrapper:
                '"<%= banner %><%= jqueryCheck %><%= jqueryVersionCheck %>'
             + '(function($){%output%})(jQuery);"',
           externs: 'js/externs/*.js'
           // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
        },

        execOpts: {
           maxBuffer: 999999 * 1024
        },

        // [OPTIONAL] Java VM optimization options
        // see https://code.google.com/p/closure-compiler/wiki/FAQ#What_are_the_recommended_Java_VM_command-line_options?
        // Setting one of these to 'true' is strongly recommended,
        // and can reduce compile times by 50-80% depending on compilation size
        // and hardware.
        // On server-class hardware, such as with Github's Travis hook,
        // TieredCompilation should be used; on standard developer hardware,
        // d32 may be better. Set as appropriate for your environment.
        // Default for both is 'false'; do not set both to 'true'.
        d32: false, // will use 'java -client -d32 -jar compiler.jar'
        TieredCompilation: false // will use 'java -server -XX:+TieredCompilation -jar compiler.jar'
      },

      targetName: {
        src: [
          'js/util.js',
          'js/alert.js',
          'js/button.js',
          'js/carousel.js',
          'js/collapse.js',
          'js/dropdown.js',
          'js/modal.js',
          'js/scrollspy.js',
          'js/tooltip.js',
          'js/popover.js',
          'js/tab.js'
        ],
        dest: 'dist/<%= pkg.name %>.min.js'
      }

    },

    qunit: {
      options: {
        inject: 'js/tests/unit/phantom.js'
      },
      files: 'js/tests/index.html'
    }

  })

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-contrib-qunit')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-closure-tools')
  grunt.loadNpmTasks('grunt-jscs')

  grunt.registerTask('test-js', ['jshint:core', 'jshint:test', 'jscs:core', 'jscs:test', 'qunit'])
  grunt.registerTask('dist-js', ['concat', 'closureCompiler'])

  // Full distribution task.
  grunt.registerTask('dist', ['clean:dist', 'dist-js'])

  // Default task.
  grunt.registerTask('default', ['clean:dist', 'test-js', 'dist'])

}