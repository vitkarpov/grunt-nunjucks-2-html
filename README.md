# Nunjucks --> HTML

It\`s a grunt plugin which renders nunjucks\` templates to HTML

Install first:

```
$ npm install grunt-nunjucks-2-html
```

and load new task into your `Gruntfile.js`

```
grunt.loadNpmTasks('grunt-nunjucks-2-html');
```

## Example usage

It could looks like this:

```javasciprt
grunt.initConfig({
  nunjucks: {
    options: {
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
  },
})
```
