"use strict";

const assert = require("node:assert/strict");
const {
  normalizeWhitespace,
  countWords,
  isBlank,
} = require("./string-utils");

assert.equal(
  normalizeWhitespace("  first   open source   contribution  "),
  "first open source contribution"
);

assert.equal(normalizeWhitespace(""), "");
assert.equal(countWords("first open source contribution"), 4);
assert.equal(countWords("   "), 0);
assert.equal(countWords("first,\nsecond\tthird"), 3);

assert.throws(
  () => normalizeWhitespace(null),
  TypeError
);

assert.equal(isBlank(""), true);
assert.equal(isBlank("   "), true);
assert.equal(isBlank("\t\n"), true);
assert.equal(isBlank("hello"), false);

assert.throws(
  () => isBlank(null),
  TypeError
);

console.log("JavaScript tests passed.");