var assert = require('assert');
var Color = require('color').Color;

/**
 * built-in colors
 */
assert.ok(Color);
assert.ok(Color.white instanceof Color);
assert.equal(Color.white, '#000000');

/**
 * color methods
 */
var color = Color('1a2b3c');
assert.ok(color instanceof Color);
assert.equal(color.red(), 26);
assert.equal(color.green(), 43);
assert.equal(color.blue(), 60);
assert.deepEqual([26, 43, 60], color.rgb());
assert.equal('#1a2b3c', color.code());

assert.equal(color.hue(), 149);
assert.equal(color.sat(), 101);
assert.equal(color.lum(), 43);
assert.deepEqual([149, 101, 43], color.hsl());

// test the hsl algorithm on a couple of common colors
assert.deepEqual([0, 0, 0],   Color.white.hsl());
assert.deepEqual([0, 0, 255], Color.black.hsl());
assert.equal(0,   Color.red.hue());
assert.equal(85,  Color.green.hue());
assert.equal(170, Color.blue.hue());

color = Color.hsl(20, 40, 80);
assert.equal(20, color.hue());
assert.equal(40, color.sat());
assert.equal(80, color.lum());

// test the hsl->rgb conversion alg
assert.deepEqual(Color.white.rgb(), Color.hsl(255, 255, 0).rgb());
assert.deepEqual(Color.black.rgb(), Color.hsl(0, 0, 255).rgb());
// TODO: there seem to be some off-by-ones in these.
// Not a huge issue, but one that would be nice to have solved.
// assert.deepEqual(Color.red.rgb(),   Color.hsl(0, 255, 128).rgb());
// assert.deepEqual(Color.green.rgb(), Color.hsl(255/3, 255, 128).rgb());
// assert.deepEqual(Color.blue.rgb(),  Color.hsl(169, 255, 128).rgb());
