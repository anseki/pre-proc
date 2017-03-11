/*
 * preProc
 * https://github.com/anseki/pre-proc
 *
 * Copyright (c) 2017 anseki
 * Licensed under the MIT license.
 */

'use strict';

var SP = '[^\\S\\n\\r]', // except line-break from \s
  BEFORE_BLOCK = '(?:\\n\\s*)?', // at least one line-break, and whitespaces or nothing
  AFTER_BLOCK = SP + '*';

/**
 * Test whether a path is target.
 * If any argument is omitted, the test passes.
 * Therefore, it indicate that the path should not be skipped rather than the path being a found target.
 * @param {string} [srcPath] - A full path.
 * @param {(string|RegExp|Array)} [pathTest] - A string which must be at the start, a RegExp which tests or an array.
 * @returns {boolean} - `true` if the `srcPath` is target.
 */
function isTargetPath(srcPath, pathTest) {
  return !srcPath || !pathTest ||
    (Array.isArray(pathTest) ? pathTest : [pathTest]).some(function(test) {
      return test instanceof RegExp ? test.test(srcPath) : srcPath.indexOf(test) === 0;
    });
}

function escapePattern(pattern) {
  return pattern.replace(/[\x00-\x7f]/g, // eslint-disable-line no-control-regex
    function(s) { return '\\x' + ('00' + s.charCodeAt().toString(16)).substr(-2); });
}

function createTagPatterns(tag) {
  tag = '\\s*' + escapePattern((tag + '').trim()) + '\\s*';
  var start = '\\[' + tag + '\\]', end = '\\[\\s*/' + tag + '\\]';
  return {
    // [TAG/] : Catch all of a line.
    empty: '[^\\n]*\\[' + tag + '/\\s*\\][^\\n]*\\n?',
    // /* [TAG] */.../* [/TAG] */
    star: BEFORE_BLOCK + '/\\*\\s*' + start + '\\s*\\*/([^]*?)/\\*\\s*' + end + '\\s*\\*/' + AFTER_BLOCK,
    // <!-- [TAG] -->...<!-- [/TAG] -->
    html: BEFORE_BLOCK + '<\\!\\-\\-\\s*' + start + '\\s*\\-\\->' +
      '([^]*?)<\\!\\-\\-\\s*' + end + '\\s*\\-\\->' + AFTER_BLOCK,
    // // [TAG]...// [/TAG]
    thrash: '\\n?' + SP + '*//' + SP + '*' + start + '[^\\n]*\\n+([^]*?)//' + SP + '*' + end + '[^\\n]*'
  };
}

/**
 * @param {(string|string[])} tag - A tag or an array of tags that are removed.
 * @param {string} content - A content that is processed.
 * @param {string} [srcPath] - A full path to the source file.
 * @param {(string|RegExp|Array)} [pathTest] - The content is changed when any test passed.
 * @returns {string} - A content that might have been changed.
 */
function removeTag(tag, content, srcPath, pathTest) {
  if (!isTargetPath(srcPath, pathTest)) { return content; }

  content = content ? content + '' : '';
  return (Array.isArray(tag) ? tag : [tag]).reduce(function(content, tag) {
    var patterns = createTagPatterns(tag);
    return content
      .replace(new RegExp(patterns.empty, 'g'), '')
      .replace(new RegExp(patterns.star, 'g'), '')
      .replace(new RegExp(patterns.html, 'g'), '')
      .replace(new RegExp(patterns.thrash, 'g'), '');
  }, content);
}

/**
 * @param {string} tag - A tag to find a part of content.
 * @param {string} content - A content that is processed.
 * @returns {string} - The found part of content.
 */
function pickTag(tag, content) {
  var patterns = createTagPatterns(tag), matches;
  content = content ? content + '' : '';
  return (matches = (new RegExp(patterns.star)).exec(content)) ? matches[1] :
    (matches = (new RegExp(patterns.html)).exec(content)) ? matches[1] :
    (matches = (new RegExp(patterns.thrash)).exec(content)) ? matches[1] :
    null;
}

exports.removeTag = removeTag;
exports.pickTag = pickTag;
