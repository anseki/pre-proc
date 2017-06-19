'use strict';

const expect = require('chai').expect,
  preProc = require('../lib/pre-proc');

describe.only('replaceTagMultipleValues()', () => {

  it('should replace specific tag', () => {
    expect(preProc.replaceTagMultipleValues([{tag: 'tag', replacement: '@foo@'}], 'aaa/*[tag]*/xxx/*[/tag]*/bbb')).to.equal('aaa@foo@bbb');
  });

  it('should replace a tag that contains meta characters', () => {
    var replacements = [
      {tag: 'a!b', replacement: '@foo@'},
      {tag: 'a b $', replacement: '@bar@'},
      {tag: '(\\a\\b)', replacement: '@bla@'}
    ];
    expect(preProc.replaceTagMultipleValues(replacements, 'aaa/*[a!b]*/xxx/*[/a!b]*/bbb')).to.equal('aaa@foo@bbb');
    expect(preProc.replaceTagMultipleValues(replacements, 'aaa/*[a b $]*/xxx/*[/a b $]*/bbb')).to.equal('aaa@bar@bbb');
    expect(preProc.replaceTagMultipleValues(replacements, 'aaa/*[(\\a\\b)]*/xxx/*[/(\\a\\b)]*/bbb')).to.equal('aaa@bla@bbb');
  });
  

  it('should replace only specific tags', () => {
    var replacements = [
      {tag: 'TAG1', replacement: '@foo@'},
      {tag: 'TAG3', replacement: '@foo@'}
    ];
    expect(preProc.replaceTagMultipleValues(replacements,
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

  it('should replace specific tags in multiple formats', () => {
    var replacements = [
      {tag: 'TAG1', replacement: '@foo@'},
      {tag: 'TAG3', replacement: '@foo@'},
      {tag: 'TAG4', replacement: '@foo@'},
      {tag: 'TAG(5)', replacement: '@foo@'},
      {tag: 'TAG[6]', replacement: '@foo@'},
      {tag: 'TAG8', replacement: '@foo@'},
      {tag: 'TAG9', replacement: '@foo@'},
    ];
    expect(preProc.replaceTagMultipleValues(replacements,
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