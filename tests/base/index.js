var expect = require('expect.js');
var fs = require('fs');
var util = require('util');
var path = require('path');

var expected = fs.readFileSync(path.join(__dirname, 'output.html')).toString();
var generated = fs.readFileSync(path.join(__dirname, '_output.html')).toString();

module.exports = function() {
    try {
        expect(expected).to.eql(generated);
    } catch(e) {
        console.log(util.inspect(e, {colors: true}));
    }
}
