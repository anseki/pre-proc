'use strict';

const expect = require('chai').expect,
  preProc = require('../lib/pre-proc');

describe('replaceTag()', function() {

  it('should replace specific tag', function() {
    expect(preProc.replaceTag('tag', '@foo@', 'aaa/*[tag]*/xxx/*[/tag]*/bbb')).to.equal('aaa@foo@bbb');
  });

  it('should replace a tag that contains meta characters', function() {
    expect(preProc.replaceTag('a!b', '@foo@', 'aaa/*[a!b]*/xxx/*[/a!b]*/bbb')).to.equal('aaa@foo@bbb');
    expect(preProc.replaceTag('a b $', '@foo@', 'aaa/*[a b $]*/xxx/*[/a b $]*/bbb')).to.equal('aaa@foo@bbb');
    expect(preProc.replaceTag('(\\a\\b)', '@foo@', 'aaa/*[(\\a\\b)]*/xxx/*[/(\\a\\b)]*/bbb')).to.equal('aaa@foo@bbb');
  });

  it('should replace only specific tags', function() {
    expect(preProc.replaceTag(['TAG1', 'TAG3'], '@foo@',
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
@foo@
xxx
// [TAG2]
foo bar4
foo bar5
// [/TAG2]
xxx
@foo@
`);
  });

  it('should replace specific tags in multiple formats', function() {
    expect(preProc.replaceTag(['TAG1', 'TAG3', 'TAG4', 'TAG(5)', 'TAG[6]', 'TAG8', 'TAG9'], '@foo@',
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
@foo@
xxx
// [TAG2]
foo bar4
foo bar5
// [/TAG2]
xxx
@foo@
foo bar8
@foo@
fo@foo@ara
foo barb
foo   @foo@c
foo bard
<!--    [TAG7]  -->
foo bare
<!--    [/TAG7]  -->
foo barf
@foo@
foo barh
foo bari@foo@
foo barl
`);
  });

});

