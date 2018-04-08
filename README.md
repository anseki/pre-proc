# preProc

[![npm](https://img.shields.io/npm/v/pre-proc.svg)](https://www.npmjs.com/package/pre-proc) [![GitHub issues](https://img.shields.io/github/issues/anseki/pre-proc.svg)](https://github.com/anseki/pre-proc/issues) [![dependencies](https://img.shields.io/badge/dependencies-No%20dependency-brightgreen.svg)](package.json) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE-MIT)

* [Grunt](http://gruntjs.com/) plugin: [grunt-pre-proc](https://github.com/anseki/grunt-pre-proc)
* [gulp](http://gulpjs.com/) plugin: [gulp-pre-proc](https://github.com/anseki/gulp-pre-proc)
* [webpack](https://webpack.js.org/) loader: [pre-proc-loader](https://github.com/anseki/pre-proc-loader)

The super simple preprocessor for front-end development.

If you want preprocessor that works like popular compilers or feature rich preprocessor, other great tools such as [preprocess](https://github.com/jsoverson/preprocess) may be better for you.  
This preProc is very simple preprocessor for front-end development. JavaScript, HTML, CSS, etc.

**Why is simple preprocessor needed?**

In front-end development, almost tasks are processed by a build script such as webpack, gulp, Grunt, etc.  
Therefore we need something that processes only a few tasks e.g. switching parameters. And it allows the build script to control its behavior flexibly. It only edits a source code by tags.

For example, in a case of JavaScript code:

```js
TEST_MODE = true; // [DEBUG/]
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
// Remove `DEBUG` contents, if current file is in `dir1` directory or it is JS file.
code = preProc.removeTag('DEBUG', code, filePath, ['/path/to/dir1', /\.js$/]);
```

### `replaceTag`

```js
changedContent = preProc.replaceTag(tag, replacement, sourceContent[, srcPath[, pathTest]])
```

Replace one or more parts of the source code with specific string.

This method is similar to the [`removeTag`](#removetag) method except that only a string that is specified for the `replacement` argument is inserted at each point that the tags existed.  
That is, the following two codes work same:

```js
changedContent = preProc.removeTag(tag, sourceContent, srcPath, pathTest);
```

```js
changedContent = preProc.replaceTag(tag, '', sourceContent, srcPath, pathTest);
```

The `replacement` can be a string or an array that contains multiple strings. If arrays are specified for both the `tag` and `replacement`, each found tag is replaced with a `replacement` element that has the same index of the array.

For example:

```js
code = preProc.replaceTag(['TAG-1', 'TAG-2', 'TAG-3'], ['VALUE-1', 'VALUE-2', 'VALUE-3'], code);
// 'TAG-1' => 'VALUE-1', 'TAG-2' => 'VALUE-2', 'TAG-3' => 'VALUE-3',
```

If the `replacement` array is shorter than the `tag` array, a last `replacement` element is repeated for the remaining `tag` elements.

For example:

```js
code = preProc.replaceTag(['TAG-1', 'TAG-2', 'TAG-3'], ['VALUE-1', 'VALUE-2'], code);
// 'TAG-1' => 'VALUE-1', 'TAG-2' => 'VALUE-2', 'TAG-3' => 'VALUE-2' (Missing `replacement[2]`),
```

```js
code = preProc.replaceTag(['TAG-1', 'TAG-2', 'TAG-3'], 'COMMON-VALUE', code);
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

When the tag was not found, this method returns `null`, not a string. It is useful for handling unknown source code.

For example:

```js
var preProc = require('pre-proc');
// ...
target = preProc.pickTag('TAG', source);
if (target != null) {
  // Do something only when the target was found. the target might be an empty string.
}
```

