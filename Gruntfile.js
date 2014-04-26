module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    watch: {
      scripts: {
        files: ['lib/**/*.js'],
        tasks: ['default'],
        options: {
          spawn: false
        }
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'lib/*'],
      options: {
        jshintrc: ".jshintrc"
      }
    },

    browserify: {
      dist: {
        files: {
          'dist/<%= pkg.name %>.js': ['lib/index.js'],
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  grunt.registerTask('default', ['jshint', 'browserify', 'uglify']);

};
