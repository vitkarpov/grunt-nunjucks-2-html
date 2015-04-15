var expect = require('expect.js');
var fs = require('fs');
var util = require('util');
var path = require('path');

var expected = [
    fs.readFileSync(path.join(__dirname, 'output1.html')).toString(),
    fs.readFileSync(path.join(__dirname, 'output2.html')).toString()
];
var generated = [
    fs.readFileSync(path.join(__dirname, '_output1.html')).toString(),
    fs.readFileSync(path.join(__dirname, '_output2.html')).toString()
];

module.exports = function() {
    expected.forEach(function(input, i) {
        try {
            expect(input).to.eql(generated[i]);
        } catch(e) {
            console.log(util.inspect(e, {colors: true}));
        }
    });
}
