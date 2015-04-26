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
      'index.html' : ['index.html']
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

## Adding filters

```javascipt
nunjucks: {
  options: {
    filters : function(env, options){
      // Example of a localization filter
      env.addFilter('trans', function(str, obj) {
        var lang = options.lang || 'en_US';
        var locale = YAML.load('locales/'+lang+'.yml');

        var string = locale[str],
            myObj = obj || {};

        for (var params in myObj) {
          if (myObj.hasOwnProperty(params)) {
            string = string.replace('%' + params + '%', myObj[params]);
          }
        }

        return string;
      });
    }
  }
```

You'll get a set of html files in `build` folder.

## Tests

```bash
$ npm test
```

## Options

### Data

Read JSON from file using `grunt.file.readJSON` or specify object just inside your `Gruntfile`.

### preprocessData

You should specify a function to construct each data object for every of your templates. Execution context for the function would be a [grunt file object](http://gruntjs.com/api/inside-tasks#this.files). If you specify a data option it would be passed inside the function as an argument.

For instance, you could include name of the file inside an every data object

```js
nunjucks: {
  options: {
    preprocessData: function(data) {
      var page = require('path').basename(this.src[0], '.html');
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
}
```

### Paths

You could specify root path for your templates, `paths` would be set for [nunjucks' configure](http://mozilla.github.io/nunjucks/api#configure)

### Customizing Syntax

If you want different tokens than {{ and the rest for variables, blocks, and comments, you can specify different tokens as the tags option:

```js
nunjucks: {
  options: {
    tags: {
      blockStart: '<%',
      blockEnd: '%>',
      variableStart: '<$',
      variableEnd: '$>',
      commentStart: '<#',
      commentEnd: '#>'
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
}
```

### configureEnvironment

You could use nunjucks' environment API to set some global options. Use `configureEnvironment` function the same way as `preprocessData`.

```js
nunjucks: {
  options: {
    configureEnvironment: function(env) {
      // for instance, let's set a global variable across all templates
      env.addGlobal('foo', 'bar');
    }
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
}
```

Check out [nunjucks' API](http://mozilla.github.io/nunjucks/api.html#environment) to know a list of available methods for environment object.

Nice!
