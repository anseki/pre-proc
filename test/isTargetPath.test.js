'use strict';

const expect = require('chai').expect,
  preProc = require('../lib/pre-proc');

describe('isTargetPath()', () => {
  // pathTest - `content` is converted to string when the test is passed.
  const CONVERTED = '1', NOT_CONVERTED = 1;

  it('should accept one that contains a path', () => {
    expect(preProc.removeTag('', 1, 'path1/path2', 'path1')).to.equal(CONVERTED);
  });
  it('should not accept one that contains a path at not the start', () => {
    expect(preProc.removeTag('', 1, 'path1/path2', 'path2')).to.equal(NOT_CONVERTED);
  });
  it('should not accept one that does not contain a path', () => {
    expect(preProc.removeTag('', 1, 'path1/path2', 'pathx')).to.equal(NOT_CONVERTED);
  });
  it('should not accept one that contains a string at not the start', () => {
    expect(preProc.removeTag('', 1, 'path1/path2', 'ath1')).to.equal(NOT_CONVERTED);
  });
  it('should accept one that contains a string in array', () => {
    expect(preProc.removeTag('', 1, 'path1/path2', ['pathx', 'path1'])).to.equal(CONVERTED);
  });
  it('should not accept one that contains a string in array at not the start', () => {
    expect(preProc.removeTag('', 1, 'path1/path2', ['pathx', 'path2'])).to.equal(NOT_CONVERTED);
  });
  it('should accept one that contains a "true"', () => {
    expect(preProc.removeTag('', 1, 'true/path2', true)).to.equal(CONVERTED);
  });
  it('should accept one that contains a "true" in array', () => {
    expect(preProc.removeTag('', 1, 'true/path2', [1, true])).to.equal(CONVERTED);
  });
  it('should accept one that contains a "1" in array', () => {
    expect(preProc.removeTag('', 1, '1/path2', [false, 1])).to.equal(CONVERTED);
  });
  it('should not accept one that contains a "true" at not the start', () => {
    expect(preProc.removeTag('', 1, 'path1/true', true)).to.equal(NOT_CONVERTED);
  });
  it('should not accept one that contains a "true" in array at not the start', () => {
    expect(preProc.removeTag('', 1, 'path1/true', [1, true])).to.equal(NOT_CONVERTED);
  });
  it('should not accept one that contains a "1" in array at not the start', () => {
    expect(preProc.removeTag('', 1, 'path1/1', [false, 1])).to.equal(NOT_CONVERTED);
  });

  it('should accept one that matches with a RegExp', () => {
    expect(preProc.removeTag('', 1, 'path1/path2', /th1\/pat/)).to.equal(CONVERTED);
  });
  it('should accept one that matches with a RegExp in array', () => {
    expect(preProc.removeTag('', 1, 'path1/path2', ['false', /th1\/pat/])).to.equal(CONVERTED);
  });
  it('should not accept one that does not match with a RegExp', () => {
    expect(preProc.removeTag('', 1, 'path1/path2', /^th1\/pat/)).to.equal(NOT_CONVERTED);
  });

  it('should accept one when srcPath is not given', () => {
    expect(preProc.removeTag('', 1, '', 'path1')).to.equal(CONVERTED);
  });
  it('should not accept one when pathTest is not given', () => {
    expect(preProc.removeTag('', 1, 'path1/path2')).to.equal(NOT_CONVERTED);
  });
  it('should accept one when srcPath and pathTest are not given', () => {
    expect(preProc.removeTag('', 1)).to.equal(CONVERTED);
  });
});
