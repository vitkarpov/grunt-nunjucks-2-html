var path = require('path');

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
        data: grunt.file.readJSON('tests/data.json'),
        preprocessData: function(data) {
          data.page = path.basename(this.src[0], '.html'); 
          return data;
        },
        configureEnvironment: function(env) {
          env.addGlobal('foo', 'bar');
        }
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