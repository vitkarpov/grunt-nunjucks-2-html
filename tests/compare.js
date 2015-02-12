var expect = require('expect.js');
var fs = require('fs');

var sample = fs.readFileSync('tests/output.html').toString();
var test = fs.readFileSync('tests/_output.html').toString();

try {
    expect(sample).to.eql(test);
} catch(e) {
    console.log(e);
    process.exit(1);
}