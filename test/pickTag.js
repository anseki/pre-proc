'use strict';

const expect = require('chai').expect,
  preProc = require('../lib/pre-proc');

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
foo bar3`);
    expect(preProc.pickTag('TAG2', CONTENT)).to.equal(`foo bar4
foo bar5`);
    expect(preProc.pickTag('TAG3', CONTENT)).to.equal(`foo bar6
foo bar7`);
    expect(preProc.pickTag('TAG4', CONTENT)).to.be.null; // eslint-disable-line no-unused-expressions
    expect(preProc.pickTag('TAG(5)', CONTENT)).to.equal('o b');
    expect(preProc.pickTag('TAG[6]', CONTENT)).to.equal('bar');
    expect(preProc.pickTag('TAG7', CONTENT)).to.equal('foo bare');
    expect(preProc.pickTag('TAG8', CONTENT)).to.equal('foo barg');
    expect(preProc.pickTag('TAG9', CONTENT)).to.equal(`foo barj
foo bark`);
    expect(preProc.pickTag('TAG$1', CONTENT)).to.equal('foo barm');
  });
});
