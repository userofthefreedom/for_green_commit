"use strict";

/**
 * 문자열 앞뒤의 공백을 제거하고 연속된 공백을 하나로 합칩니다.
 *
 * @param {string} text
 * @returns {string}
 */
function normalizeWhitespace(text) {
  if (typeof text !== "string") {
    throw new TypeError("text must be a string");
  }

  return text.trim().replace(/\s+/g, " ");
}

/**
 * 문자열에 포함된 단어 수를 반환합니다.
 *
 * @param {string} text
 * @returns {number}
 */
function countWords(text) {
  const normalized = normalizeWhitespace(text);

  if (normalized === "") {
    return 0;
  }

  return normalized.split(" ").length;
}

/**
 * 문자열이 비어 있거나 공백으로만 구성되어 있는지 확인합니다.
 *
 * @param {string} text
 * @returns {boolean}
 */
function isBlank(text) {
  return normalizeWhitespace(text) === "";
}

/**
 * Reverse the words in a string.
 *
 * @param {string} text
 * @returns {string}
 */
function reverseWords(text) {
  const normalized = normalizeWhitespace(text);
  if (normalized === "") {
    return "";
  }
  return normalized.split(" ").reverse().join(" ");
}

module.exports = {
  normalizeWhitespace,
  countWords,
  isBlank,
  reverseWords,
};