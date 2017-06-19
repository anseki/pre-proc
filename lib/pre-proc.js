/*
 * preProc
 * https://github.com/anseki/pre-proc
 *
 * Copyright (c) 2017 anseki
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Test whether a path is target.
 * @param {string} [srcPath] - A full path.
 * @param {(string|RegExp|Array)} [pathTest] - A string which must be at the start, a RegExp which tests or an array.
 * @returns {boolean} - `true` if the `srcPath` is target, or `srcPath` is omitted.
 */
function isTargetPath(srcPath, pathTest) {
  return !srcPath ||
    (Array.isArray(pathTest) ? pathTest : [pathTest]).some(function(test) {
      return test && (test instanceof RegExp ? test.test(srcPath) : srcPath.indexOf(test) === 0);
    });
}

function createTagPatterns(tag, catchLB) {

  function escapePattern(pattern) {
    return pattern.replace(/[\x00-\x7f]/g, // eslint-disable-line no-control-regex
      function(s) { return '\\x' + ('00' + s.charCodeAt().toString(16)).substr(-2); });
  }

  var SP = '[^\\S\\n\\r]', // except line-break from \s
    BEFORE_BLOCK = '(?:\\n\\s*)?', // at least one line-break, and whitespaces or nothing
    AFTER_BLOCK = SP + '*';

  tag = '\\s*' + escapePattern((tag + '').trim()) + '\\s*';
  var start = '\\[' + tag + '\\]', end = '\\[\\s*/' + tag + '\\]';

  return {
    // [TAG/] : Catch all of a line.
    empty: '[^\\n]*\\[' + tag + '/\\s*\\][^\\n]*' + (catchLB ? '\\n?' : ''),
    // /* [TAG] */.../* [/TAG] */
    star: (catchLB ? BEFORE_BLOCK : '') + '/\\*\\s*' + start + '\\s*\\*/' +
      '([^]*?)/\\*\\s*' + end + '\\s*\\*/' + AFTER_BLOCK,
    // <!-- [TAG] -->...<!-- [/TAG] -->
    html: (catchLB ? BEFORE_BLOCK : '') + '<\\!\\-\\-\\s*' + start + '\\s*\\-\\->' +
      '([^]*?)<\\!\\-\\-\\s*' + end + '\\s*\\-\\->' + AFTER_BLOCK,
    // // [TAG]...// [/TAG]
    thrash: (catchLB ? '\\n?' : '') + SP + '*//' + SP + '*' + start + '[^\\n]*\\n+' +
      '([^]*?)//' + SP + '*' + end + '[^\\n]*'
  };
}

function replaceContent(content, tag, replacement) {

  var patterns = createTagPatterns(tag, !replacement);

  return content
    .replace(new RegExp(patterns.empty, 'g'), replacement)
    .replace(new RegExp(patterns.star, 'g'), replacement)
    .replace(new RegExp(patterns.html, 'g'), replacement)
    .replace(new RegExp(patterns.thrash, 'g'), replacement);
}

/**
 * @param {(string|string[])} tag - A tag or an array of tags that are removed.
 * @param {string} replacement - A string that replaces the parts.
 * @param {string} content - A content that is processed.
 * @param {string} [srcPath] - A full path to the source file.
 * @param {(string|RegExp|Array)} [pathTest] - The content is changed when any test passed.
 * @returns {string} - A content that might have been changed.
 */
function replaceTag(tag, replacement, content, srcPath, pathTest) {
  if (!isTargetPath(srcPath, pathTest)) { return content; }

  content = content ? content + '' : '';
  var arrayTags = Array.isArray(tag) ? tag : [tag];

  return arrayTags.reduce(function(content, tag) {
    if (!tag) { return content; }

    return replaceContent(content, tag, replacement);
  }, content);
}

/**
  * @param Array<{string, string}> replacements - Array of tags & values to replace those
  * @param {string} content - A content that is processed. 
*/
function replaceTagMultipleValues(replacements, content) {
  content = content ? content + '' : '';
  replacements = replacements || [];
  
  if(!replacements.length) {
    return content;
  }

  return replacements.reduce(function(content, replacement) {
    var tag = replacement.tag;
    var replacement = replacement.replacement;

    return replaceContent(content, tag, replacement);
  }, content);
}

/**
 * @param {(string|string[])} tag - A tag or an array of tags that are removed.
 * @param {string} content - A content that is processed.
 * @param {string} [srcPath] - A full path to the source file.
 * @param {(string|RegExp|Array)} [pathTest] - The content is changed when any test passed.
 * @returns {string} - A content that might have been changed.
 */
function removeTag(tag, content, srcPath, pathTest) {
  return replaceTag(tag, '', content, srcPath, pathTest);
}

/**
 * @param {string} tag - A tag to find a part of content.
 * @param {string} content - A content that is processed.
 * @returns {string} - The found part of content.
 */
function pickTag(tag, content) {
  if (!tag) { return null; }

  content = content ? content + '' : '';

  var patterns = createTagPatterns(tag), matches;
  return (matches = (new RegExp(patterns.star)).exec(content)) ? matches[1].trim() :
    (matches = (new RegExp(patterns.html)).exec(content)) ? matches[1].trim() :
    (matches = (new RegExp(patterns.thrash)).exec(content)) ? matches[1].trim() :
    null;
}

exports.replaceTag = replaceTag;
exports.replaceTagMultipleValues = replaceTagMultipleValues;
exports.removeTag = removeTag;
exports.pickTag = pickTag;