## require/AMD friendly mustache.js jQuery wrapper

Based on [mustache.js](https://github.com/janl/mustache.js/) and mostly compatible with [jquery-Mustache](https://github.com/jonnyreeves/jquery-Mustache),
this is a project that wraps Mustache in extra jQuery goodness in one single file. Without this, there's a bit too much extra magic to do exactly right to
get it all to load and minify. This is just convenience.

The plugin loads just fine without [require.js](http://requirejs.org/), but the main purpose of this version is to be
[AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) compatible.

### Usage

The only dependency is jQuery.

#### Loading with require.js

You can either use `$.Mustache`:

```javascript
require(['jquery', 'jquery.mustache'], function($) {
	$.Mustache.load('template.mustache', function() {
		...
	})
}
```

or load the same variable as a parameter to the callback:

```javascript
require(['jquery', 'jquery.mustache'], function($, $mustache) {
	$mustache.load('template.mustache', function() {
		...
	})
}
```

or, as dependency (with or without `$mustache`object):
```javascript
define(['jquery', 'lib/jquery.mustache'], function($, $mustache) {
	...
}
```

This document will use the `$.Mustache` style in examples, but it's the same object.

#### Loading without require.js

```html
<script src="https://code.jquery.com/jquery-1.11.0.min.js"></script>
<script src="jquery.mustache.js"></script>
```

Only `$.Mustache` is available.

### API

#### add()

Adds a template to the template cache, for future use.

```javascript
$.Mustache.add('added-template', '<p>{{test}}</p>');
var html = $.Mustache.render('added-template', {test: 'Replaced value'});
```

#### addFromDom()

Reads templates from the current document. Takes an id or a list of ids to find, or if no argument, looks for `<script type="text/html">` elements and loads
those as templates. The templates must always have a unique id attribute.

```html
<script type="text/html" id="inline-template">
	<p>{{test}}</p>
</script>
```

```javascript
$.Mustache.addFromDom('inline-template');
var html = $.Mustache.render('inline-template', {test: 'Replaced value'});
```

#### clear()

Remove all added templates from cache.

```javascript
$.Mustache.clear();
```

#### has()

Check for existence of added template.

```javascript
$.Mustache.addFromDom('inline-template');
if($.Mustache.has('inline-template')) {
	...
}
```

#### instance

The mustache.js instance.

#### load()

Loads a template file using AJAX. otherwise works as `addFromDom`with no parameters, finds all `<script type="text/html">` in the HTML and adds them as
templates. Has an optional callback that is executed after the templates are loaded.

Also returns the jqxhr object from jQuery's $.get(), but beware that it may fire before the templates are read into cache,
as it fires when the AJAX call is done. Mostly useful for `fail()` callback.

```javascript
$.Mustache.load('template.mustache', function() {
	$.Mustache.render(...);
});
```

#### remove()

Remove a template.

```javascript
$.Mustache.remove('template');
```

#### render()

Render a template. See [mustache.js](https://github.com/janl/mustache.js) for the actual rules.

```javascript
$.Mustache.add('added-template', '<p>{{test}}</p>');
var html = $.Mustache.render('added-template', {test: 'Replaced value'});
```

#### templates()

List the added templates.

```javascript
var templates = $.Mustache.templates();
```

#### $('#element').mustache()

jQuery plugin version, render a template into the object.

```javascript
var $renderIntoMe = $('#render-into-me');
$renderIntoMe.mustache('template', {test: 'Replaced value'});
```

Uses `append()` by default, but can be overridden by adding an option "method" such as "html" or "prepend".

```javascript
var $renderIntoMe = $('#render-into-me');
$renderIntoMe.mustache('template', {test: 'Replaced value'}, {method: 'html');
```

### Partials

The plugin handles [partials](https://github.com/janl/mustache.js#partials), as long as the partial is also loaded into the cache. Put the templates and
partials all into one file and load them in one go and you're set. :)

### Differences from [jquery-Mustache](https://github.com/jonnyreeves/jquery-Mustache)

The API is (almost) copied from jquery-Mustache, since I used that first and liked it.

There are currently no options, but rather sane defaults:

* warnOnMissingTemplates - always fail instead, wrap in try/catch if needed.
* allowOverwrite - always allowed. Check with `has()` if needed.
* domTemplateType - always 'text/html'
* externalTemplateDataType - not used (but let me know if it is necessary!)

`addFromDom()` needs one string, or an array of strings instead of just looping the special arguments array. This may change if important.

Templates are pre-parsed as they are added.

The rest is (hopefully) implemented as documented and actually used, but see also the test suite.

### Build manually

Install [Node.js](http://nodejs.org/) and [Jake](https://github.com/mde/jake)

Download latest mustache.js from github with

	jake update

Build the finished jquery.mustache.js with

	jake build

### Running the test suite

The tests are written using [QUnit](http://qunitjs.com/).

Run the project in a web server and open test/with_require.html and test/no_require.html in a browser. The `load()` method will fail without a web server.


