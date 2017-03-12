# preProc

[![npm](https://img.shields.io/npm/v/pre-proc.svg)](https://www.npmjs.com/package/pre-proc) [![GitHub issues](https://img.shields.io/github/issues/anseki/pre-proc.svg)](https://github.com/anseki/pre-proc/issues) [![dependencies](https://img.shields.io/badge/dependencies-No%20dependency-brightgreen.svg)](package.json) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE-MIT)

The super simple preprocessor for front-end development.

If you want preprocessor that works like popular compilers or feature rich preprocessor, other great tools such as [preprocess](https://github.com/jsoverson/preprocess) may be better for you.  
This preProc is very simple preprocessor for front-end development. JavaScript, HTML, CSS, etc.

**Why is simple preprocessor needed?**

In front-end development, almost tasks are processed by a build script such as webpack, gulp, Grunt, etc.  
Therefore we need something that processes only a few tasks e.g. switching parameters. And it allow the build script to control its behavior flexibly. It only edits a source code by tags.

For example, in a case of JavaScript code:

```js
test = true; // [DEBUG/]
```

Remove a line marked by `DEBUG` tag:

```js
var preProc = require('pre-proc');
// ...
code = preProc.removeTag('DEBUG', code);
```

## Tags

The preProc finds specific tag in the source code, and it does something.  
You can insert tags by using comment syntax of each language.  
Supported syntax:

```js
/* TAG */
```

```html
<!-- TAG -->
```

```js
// TAG
```

To indicate a part of the code, the following tag types are supported:

- `[TAG/]` : An empty tag indicates a line (i.e. all of the line that contains this tag).
- `[TAG]` ... `[/TAG]` : A pair of a start tag and an end tag indicates a string between those. The string might contain multiple lines.

## Methods

### `removeTag`

```js
changedContent = preProc.removeTag(tag, sourceContent[, srcPath[, pathTest]])
```

Remove one or more parts of the source code.

The `tag` can be a string as single tag or an array that contains multiple tags. This method finds empty tags and pairs of a start tag and an end tag.

The `sourceContent` is a string that is the source code.

For example, in a case of CSS code:

```css
.foo {
  display: none;
  display: block; /* [TEST-VIEW/] */
}

/* [DEBUG] */
.debug-info {
  font-size: 1.5em;
}
/* [/DEBUG] */
```

```js
var preProc = require('pre-proc');
// ...
cssCode = preProc.removeTag(['TEST-VIEW', 'DEBUG'], cssCode);
```

Result (`cssCode`):

```css
.foo {
  display: none;
}
```

The `srcPath` and `pathTest` provide a convenient filter.  
If a path to the source file is specified for the `srcPath`, the method finds the `tag` only when that `srcPath` was matched to the `pathTest`.  
The `pathTest` can be a string that must be at the start of the `srcPath`, a RegExp that tests the `srcPath` or an array that contains multiple. The method finds the `tag` when any one was matched.

For example:

```js
// All files in `dir1` directory and all JS files.
code = preProc.removeTag('DEBUG', code, filePath, ['/path/to/dir1', /\.js$/]);
```

### `pickTag`

```js
partOfContent = preProc.pickTag(tag, sourceContent)
```

Get a part of the source code.

The `tag` is a string as a tag. This method finds a pair of a start tag and an end tag.

The `sourceContent` is a string that is the source code.

For example, in a case of HTML code:

```html
<!DOCTYPE html>
<html>
<body>
<!-- [PANEL] -->
<div>
  foo bar
</div>
<!-- [/PANEL] -->
</body>
</html>
```

```js
var preProc = require('pre-proc');
// ...
htmlPanel = preProc.pickTag('PANEL', html);
```

Result (`htmlPanel`):

```html
<div>
  foo bar
</div>
```
