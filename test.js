var assert = require('assert');
var Color = require('./color').Color;

assert.ok(Color);
assert.ok(Color.white instanceof Color);

var color = Color.hex('1a2b3c');
assert.ok(color instanceof Color);
console.log(color.hsl());
assert.ok(color.hsl() instanceof Array);
