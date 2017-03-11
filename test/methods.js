'use strict';

const expect = require('chai').expect,
  preProc = require('../lib/pre-proc');

describe('removeTag()', function() {

  describe('isTargetPath()', function() {
    // pathTest - `content` is converted to string when the test is passed.
    const CONVERTED = '1', NOT_CONVERTED = 1;

    it('should accept one that contains a path', function() {
      expect(preProc.removeTag('', 1, 'path1/path2', 'path1')).to.equal(CONVERTED);
    });
    it('should not accept one that contains a path at not the start', function() {
      expect(preProc.removeTag('', 1, 'path1/path2', 'path2')).to.equal(NOT_CONVERTED);
    });
    it('should not accept one that does not contain a path', function() {
      expect(preProc.removeTag('', 1, 'path1/path2', 'pathx')).to.equal(NOT_CONVERTED);
    });
    it('should not accept one that contains a string at not the start', function() {
      expect(preProc.removeTag('', 1, 'path1/path2', 'ath1')).to.equal(NOT_CONVERTED);
    });
    it('should accept one that contains a string in array', function() {
      expect(preProc.removeTag('', 1, 'path1/path2', ['pathx', 'path1'])).to.equal(CONVERTED);
    });
    it('should not accept one that contains a string in array at not the start', function() {
      expect(preProc.removeTag('', 1, 'path1/path2', ['pathx', 'path2'])).to.equal(NOT_CONVERTED);
    });
    it('should accept one that contains a "true"', function() {
      expect(preProc.removeTag('', 1, 'true/path2', true)).to.equal(CONVERTED);
    });
    it('should accept one that contains a "true" in array', function() {
      expect(preProc.removeTag('', 1, 'true/path2', [1, true])).to.equal(CONVERTED);
    });
    it('should accept one that contains a "1" in array', function() {
      expect(preProc.removeTag('', 1, '1/path2', [false, 1])).to.equal(CONVERTED);
    });
    it('should not accept one that contains a "true" at not the start', function() {
      expect(preProc.removeTag('', 1, 'path1/true', true)).to.equal(NOT_CONVERTED);
    });
    it('should not accept one that contains a "true" in array at not the start', function() {
      expect(preProc.removeTag('', 1, 'path1/true', [1, true])).to.equal(NOT_CONVERTED);
    });
    it('should not accept one that contains a "1" in array at not the start', function() {
      expect(preProc.removeTag('', 1, 'path1/1', [false, 1])).to.equal(NOT_CONVERTED);
    });

    it('should accept one that matches with a RegExp', function() {
      expect(preProc.removeTag('', 1, 'path1/path2', /th1\/pat/)).to.equal(CONVERTED);
    });
    it('should accept one that matches with a RegExp in array', function() {
      expect(preProc.removeTag('', 1, 'path1/path2', ['false', /th1\/pat/])).to.equal(CONVERTED);
    });
    it('should not accept one that does not match with a RegExp', function() {
      expect(preProc.removeTag('', 1, 'path1/path2', /^th1\/pat/)).to.equal(NOT_CONVERTED);
    });

    it('should accept one when srcPath is not given', function() {
      expect(preProc.removeTag('', 1, '', 'path1')).to.equal(CONVERTED);
    });
    it('should accept one when pathTest is not given', function() {
      expect(preProc.removeTag('', 1, 'path1/path2')).to.equal(CONVERTED);
    });
    it('should accept one when srcPath and pathTest are not given', function() {
      expect(preProc.removeTag('', 1)).to.equal(CONVERTED);
    });
  });

  it('should remove specific tag', function() {
    expect(preProc.removeTag('tag', 'aaa/*[tag]*/xxx/*[/tag]*/bbb')).to.equal('aaabbb');
  });

  it('should remove a tag that contains meta characters', function() {
    expect(preProc.removeTag('a!b', 'aaa/*[a!b]*/xxx/*[/a!b]*/bbb')).to.equal('aaabbb');
    expect(preProc.removeTag('a b $', 'aaa/*[a b $]*/xxx/*[/a b $]*/bbb')).to.equal('aaabbb');
    expect(preProc.removeTag('(\\a\\b)', 'aaa/*[(\\a\\b)]*/xxx/*[/(\\a\\b)]*/bbb')).to.equal('aaabbb');
  });

  it('should remove only specific tags', function() {
    expect(preProc.removeTag(['TAG1', 'TAG3'],
      `foo bar1
// [TAG1]
foo bar2
foo bar3
// [/TAG1]
xxx
// [TAG2]
foo bar4
foo bar5
// [/TAG2]
xxx
// [TAG3]
foo bar6
foo bar7
// [/TAG3]
`)).to.equal(`foo bar1
xxx
// [TAG2]
foo bar4
foo bar5
// [/TAG2]
xxx
`);
  });

  it('should remove specific tags in multiple formats', function() {
    expect(preProc.removeTag(['TAG1', 'TAG3', 'TAG4', 'TAG(5)', 'TAG[6]', 'TAG8', 'TAG9'],
      `foo bar1
// [TAG1]
foo bar2
foo bar3
// [/TAG1]
xxx
// [TAG2]
foo bar4
foo bar5
// [/TAG2]
xxx
//   [  TAG3  ]
foo bar6
foo bar7
//   [ / TAG3  ]
foo bar8
foo [ TAG4 / ]  bar9
fo/*[ TAG(5)]*/o b/*[ / TAG(5)]*/ara
foo barb
foo   /*[ TAG[6]]*/ bar   /*[ / TAG[6]]*/  c
foo bard
<!--    [TAG7]  -->
foo bare
<!--    [/TAG7]  -->
foo barf
<!--   [TAG8]  -->
foo barg
<!--  [/TAG8]  -->
foo barh
foo bari   // [TAG9]   dummy
foo barj
foo bark //[/TAG9]  dummy
foo barl
`)).to.equal(`foo bar1
xxx
// [TAG2]
foo bar4
foo bar5
// [/TAG2]
xxx
foo bar8
foara
foo barb
foo   c
foo bard
<!--    [TAG7]  -->
foo bare
<!--    [/TAG7]  -->
foo barf
foo barh
foo bari
foo barl
`);
  });

});

describe('pickTag()', function() {
  it('should get specific tag in multiple formats', function() {
    const CONTENT = `foo bar1
// [TAG1]
foo bar2
foo bar3
// [/TAG1]
xxx
// [TAG2]
foo bar4
foo bar5
// [/TAG2]
xxx
//   [  TAG3  ]
foo bar6
foo bar7
//   [ / TAG3  ]
foo bar8
foo [ TAG4 / ]  bar9
fo/*[ TAG(5)]*/o b/*[ / TAG(5)]*/ara
foo barb
foo   /*[ TAG[6]]*/ bar   /*[ / TAG[6]]*/  c
foo bard
<!--    [TAG7]  -->
foo bare
<!--    [/TAG7]  -->
foo barf
<!--   [TAG8]  -->
foo barg
<!--  [/TAG8]  -->
foo barh
foo bari   // [TAG9]   dummy
foo barj
foo bark //[/TAG9]  dummy
foo barl
/* [TAG$1] */
foo barm
/* [/TAG$1] */
foo barn
foo baro
`;

    expect(preProc.pickTag('TAG0', CONTENT)).to.be.null; // eslint-disable-line no-unused-expressions
    expect(preProc.pickTag('TAG1', CONTENT)).to.equal(`foo bar2
foo bar3
`);
    expect(preProc.pickTag('TAG2', CONTENT)).to.equal(`foo bar4
foo bar5
`);
    expect(preProc.pickTag('TAG3', CONTENT)).to.equal(`foo bar6
foo bar7
`);
    expect(preProc.pickTag('TAG4', CONTENT)).to.be.null; // eslint-disable-line no-unused-expressions
    expect(preProc.pickTag('TAG(5)', CONTENT)).to.equal('o b');
    expect(preProc.pickTag('TAG[6]', CONTENT)).to.equal(' bar   ');
    expect(preProc.pickTag('TAG7', CONTENT)).to.equal(`
foo bare
`);
    expect(preProc.pickTag('TAG8', CONTENT)).to.equal(`
foo barg
`);
    expect(preProc.pickTag('TAG9', CONTENT)).to.equal(`foo barj
foo bark `);
    expect(preProc.pickTag('TAG$1', CONTENT)).to.equal(`
foo barm
`);
  });
});
