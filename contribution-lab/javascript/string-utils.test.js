"use strict";

const assert = require("node:assert/strict");
const {
  normalizeWhitespace,
  countWords,
  isBlank,
  reverseWords,
} = require("./string-utils");

assert.equal(
  normalizeWhitespace("  first   open source   contribution  "),
  "first open source contribution"
);

assert.equal(normalizeWhitespace(""), "");
assert.equal(countWords("first open source contribution"), 4);
assert.equal(countWords("   "), 0);

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

assert.equal(
  reverseWords("first open source contribution"),
  "contribution source open first"
);
assert.equal(reverseWords(""), "");

console.log("JavaScript tests passed.");