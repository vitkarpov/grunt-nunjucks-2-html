var expect = require('expect.js');
var fs = require('fs');
var util = require('util');

var sample = fs.readFileSync('tests/output.html').toString();
var test = fs.readFileSync('tests/_output.html').toString();

try {
    expect(sample).to.eql(test);
} catch(e) {
    console.log(util.inspect(e, {colors: true}));
    process.exit(1);
}