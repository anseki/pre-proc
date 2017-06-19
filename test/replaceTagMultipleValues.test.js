'use strict';

const expect = require('chai').expect,
  preProc = require('../lib/pre-proc');

describe('replaceTagsDistinctValues()', () => {

  it('should replace tags those contains meta characters', () => {
    var replacements = [
      {tag: 'a!b', replacement: '@foo@'},
      {tag: 'a b $', replacement: '@bar@'},
      {tag: '(\\a\\b)', replacement: '@bla@'}
    ];
    expect(preProc.replaceTagsDistinctValues(replacements, 'aaa/*[a!b]*/xxx/*[/a!b]*/bbb')).to.equal('aaa@foo@bbb');
    expect(preProc.replaceTagsDistinctValues(replacements, 'aaa/*[a b $]*/xxx/*[/a b $]*/bbb')).to.equal('aaa@bar@bbb');
    expect(preProc.replaceTagsDistinctValues(replacements, 'aaa/*[(\\a\\b)]*/xxx/*[/(\\a\\b)]*/bbb')).to.equal('aaa@bla@bbb');
  });

it('should replace array tags with distinct array of replacements and unique tag with your distinct value', () => {
	var replacements = [
    {tag: ['a!b', 'tag'], replacement: ['@foo@', '@foo2@']},
    {tag: 'a b $', replacement: '@bar@'},
  ];
	var content = 'aaa/*[a!b]*/xxx/*[/a!b]*/bbb/*[tag]*/yyy/*[/tag]*/ccc/*[a b $]*/zzz/*[/a b $]*/';
  expect(preProc.replaceTagsDistinctValues(replacements, content)).to.equal('aaa@foo@bbb@foo2@ccc@bar@');
});

it('should replace specific tags in multiple formats', () => {
  var replacements = [
    {tag: 'TAG1', replacement: '@foo@'},
    {tag: 'TAG3', replacement: '@foo3@'},
    {tag: 'TAG4', replacement: '@foo4@'},
    {tag: 'TAG(5)', replacement: '@foo(5)@'},
    {tag: 'TAG[6]', replacement: '@foo[6]@'},
    {tag: 'TAG8', replacement: '@foo8@'},
    {tag: 'TAG9', replacement: '@foo9@'},
  ];
  expect(preProc.replaceTagsDistinctValues(replacements,
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
@foo3@
foo bar8
@foo4@
fo@foo(5)@ara
foo barb
foo   @foo[6]@c
foo bard
<!--    [TAG7]  -->
foo bare
<!--    [/TAG7]  -->
foo barf
@foo8@
foo barh
foo bari@foo9@
foo barl
`);
  });

});
