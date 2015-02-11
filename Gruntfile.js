module.exports = function(grunt) {
  grunt.initConfig({
    jscs: {
      src: "tasks/nunjucks.js",
      options: {
        config: ".jscsrc"
      }
    },
    mocha: {
      test: {
        fsrc: ['tests/*.js'],
        options: {
          reporter: 'Nyan',
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask("test", ["jscs", "mocha"]);
}