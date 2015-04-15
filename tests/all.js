var path = require('path');
var tests = ['base', 'leaking-vars'];

tests.forEach(function(folder) {
    require(path.join(__dirname, folder))();
});
