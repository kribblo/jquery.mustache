var fs = require('fs');

var mustacheUrl = 'https://raw.githubusercontent.com/janl/mustache.js/master/mustache.js';

desc('Default: print some help');
task('default', function (params) {
	console.log('Use "jake update" to download the latest mustache.js and "jake build" to build jquery.mustache.js');
});

desc('Update mustache.js');
task('update', function (params) {
	console.log('Updating mustache.js');

	var https = require('https');
	var mustacheJs = '';
	var request = https.get(mustacheUrl, function(response) {
		response.on('data', function(chunk) {
			mustacheJs += chunk;
		});

		response.on('end', function() {
			var updatedMustacheJs = mustacheJs.replace('define([\'exports\'], factory)', 'define(\'mustache\', [\'exports\'], factory)');
			if(updatedMustacheJs === mustacheJs) {
				fail('Could not rewrite mustache.js, maybe the original file has changed?');
			}
			fs.writeFileSync('./src/mustache.js', updatedMustacheJs);
		});
	});
});

desc('Build and write jquery.mustache.js');
task('build', function() {
	console.log('Building jquery.mustache.js');

	var Mustache = require('./src/mustache.js');

	var template = fs.readFileSync('./src/jquery.mustache.template', 'utf8');

	var view = {
		mustache: fs.readFileSync('./src/mustache.js', 'utf8'),
		jqueryMustache: fs.readFileSync('./src/jquery.mustache.js', 'utf8')
	};

	var output = Mustache.render(template, view);

	fs.writeFileSync('./jquery.mustache.js', output);
});
