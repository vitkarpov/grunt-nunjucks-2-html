# Grunt task for rendering nunjucks` templates to HTML

[![NPM version](https://badge.fury.io/js/grunt-nunjucks-2-html.png)](http://badge.fury.io/js/grunt-nunjucks-2-html)

## Getting start

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide.

Once plugin has been installed include it in your `Gruntfile.js`

```javascript
grunt.loadNpmTasks('grunt-nunjucks-2-html');
```

## Usage examples

Task targets and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

```javascript
nunjucks: {
  options: {
    data: grunt.file.readJSON('data.json'),
    paths: 'templates'
  },
  render: {
    files: {
      'index.html' : 'index.html'
    }
  }
}
```

`templates/index.html` (relative to the gruntfile) is now compiled with `data.json`!

```javascipt
nunjucks: {
  options: {
    data: grunt.file.readJSON('data.json')
  },
  render: {
    files: [
       {
          expand: true,
          cwd: "bundles/",
          src: "*.html",
          dest: "build/",
          ext: ".html"
       }
    ]
  }
```

You'll get a set of html files in `build` folder.

## Options

### data

Read JSON from file using `grunt.file.readJSON` or specify object just inside your `Gruntfile`.

### preprocessData

You should specify a function to construct each data object for every of your templates. Execution context for the function would be a [grunt file object](http://gruntjs.com/api/inside-tasks#this.files). If you specify a data option it would be passed inside the function as an argument.

For instance, you could include name of the file inside an every data object

```javascipt

var path = require('path');

...

nunjucks: {
  options: {
    preprocessData: function(data) {
      var page = path.basename(this.src[0], '.html');
      var result = {
        page: page,
        data: data
      };
      return result;
    },
    data: grunt.file.readJSON('data.json')
  },
  render: {
    files: [
       {
          expand: true,
          cwd: "bundles/",
          src: "*.html",
          dest: "build/",
          ext: ".html"
       }
    ]
  }
```

Nice!
