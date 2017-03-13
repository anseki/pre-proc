'use strict';

const expect = require('chai').expect,
  preProc = require('../lib/pre-proc');

describe('removeTag()', function() {

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

