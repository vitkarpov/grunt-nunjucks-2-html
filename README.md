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

You should define some options:

* `templatesFolder` — nunjucks' templates live here, engine will try to resolve your includes relative to that folder
* `data` — each template takes data for rendering: `{ page: '...', content: {...} }`. There is current page (basename of the html file path) and content object which is specified via this data option

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
