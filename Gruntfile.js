module.exports = function(grunt) {
  grunt.initConfig({
    jscs: {
      src: ["tasks/nunjucks.js", "tests/compare.js"],
      options: {
        config: ".jscsrc"
      }
    },
    nunjucks: {
      options: {
        data: grunt.file.readJSON('tests/data.json')
      },
      render: {
        files: {
          'tests/_output.html' : ['tests/input.html']
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadTasks("tasks/");

  grunt.registerTask("jscs", ["jscs"]);
  grunt.registerTask("test", ["nunjucks"]);
}