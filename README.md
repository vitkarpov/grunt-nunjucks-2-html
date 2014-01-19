# Nunjucks --> HTML

[![NPM version](https://badge.fury.io/js/grunt-nunjucks-2-html.png)](http://badge.fury.io/js/grunt-nunjucks-2-html)

It\`s a grunt plugin which renders nunjucks\` templates to HTML.

Install first:

```
$ npm install grunt-nunjucks-2-html
```

and load new task into your `Gruntfile.js`

```
grunt.loadNpmTasks('grunt-nunjucks-2-html');
```

## Example usage

Put all of your templates to the one folder, set is as `templatesFolder` option.

```javasciprt
grunt.initConfig({
  nunjucks: {
    options: {
      templatesFolder: 'bundles',
      data: grunt.file.readJSON('templates-data.json')
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
});
```
