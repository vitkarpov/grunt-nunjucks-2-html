var expect = require('expect.js');
var fs = require('fs');
var util = require('util');

var sample1 = fs.readFileSync('tests/leaking-vars/output1.html').toString();
var sample2 = fs.readFileSync('tests/leaking-vars/output1.html').toString();
var test1 = fs.readFileSync('tests/leaking-vars/_output2.html').toString();
var test2 = fs.readFileSync('tests/leaking-vars/_output2.html').toString();

try {
    expect(sample1).to.eql(test1);
    expect(sample2).to.eql(test2);
} catch(e) {
    console.log(util.inspect(e, {colors: true}));
    process.exit(1);
}