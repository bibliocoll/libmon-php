module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-wiredep');

    // Default task(s).
    //grunt.registerTask('default', ['uglify']);

wiredep: {

  task: {

    // Point to the files that should be updated when
    // you run `grunt wiredep`
    src: [
      'app/**/*.html',   // .html support...
      'app/styles/main.scss'  // .scss & .sass support...
      //'app/config.yml'         // and .yml & .yaml support out of the box!
    ],

    options: {
      // See wiredep's configuration documentation for the options
      // you may pass:
      // https://github.com/taptapship/wiredep#configuration
    }
  }
}

};
