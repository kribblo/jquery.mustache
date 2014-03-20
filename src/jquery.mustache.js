(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define('jquery.mustache', ['jquery', 'mustache'], factory);
	} else {
		factory(window.jQuery, window.Mustache);
	}
}(function ($, Mustache) {
	var templateMap = {};

	$.Mustache = {
		add: add,
		addFromDom: addFromDom,
		clear: clear,
		has: has,
		instance: Mustache,
		load: load,
		remove: remove,
		render: render,
		templates: templates
	};

	/**
	 * jQuery plugin version of the $.Mustache.render, renders into the matched objects and chains properly
	 *
	 * @param {String} template the template id of a previously added template
	 * @param {Array|Object} views the view data to render the template with, can be a list
	 * @param {Object} options only supports the method, defaults to 'append', can be any jQuery method that makes sense, such as 'html' or 'prepend'
	 * @returns {jQuery} the chained jQuery object
	 */
	$.fn.mustache = function(template, views, options) {
		var defaults = {
			method: 'append'
		};

		options = $.extend(defaults, options);
		views = $.isArray(views) ? views : [views];

		var renderings = [];
		for (var i = 0; i < views.length; i++) {
			var view = views[i];
			renderings.push(render(template, view));
		}

		return this.each(function() {
			for (var i = 0; i < renderings.length; i++) {
				var r = renderings[i];
				$(this)[options.method](r);
			}
		});
	};

	/**
	 * Removes all loaded templates
	 */
	function clear() {
		templateMap = {};
		Mustache.clearCache();
	}

	/**
	 * Remove a template
	 *
	 * @param {String} template the template id to delete
	 * @returns {String} the template content
	 */
	function remove(template) {
		var content = templateMap[template];
		delete templateMap[template];
		return content;
	}

	/**
	 * Check if template has been added
	 *
	 * @param {String} template a template id
	 * @returns {boolean} if template has been loaded
	 */
	function has(template) {
		return template in templateMap;
	}

	/**
	 * list the added templates
	 *
	 * @returns {Array} list of loaded template ids
	 */
	function templates() {
		return $.map(templateMap, function(_, key) {
			return key;
		});
	}

	/**
	 * Adds a template for future use
	 *
	 * @param {String} template the template id
	 * @param {String} content the template content
	 */
	function add(template, content) {
		templateMap[template] = content;
	}

	/**
	 * Finds elements with matching templateIds in the DOM (current document) and adds the content as templates.
	 *
	 * @param {Array|String} templateIds
	 */
	function addFromDom(templateIds) {
		if(!templateIds) {
			addAlltemplatesInHtml($('*'))
		}

		templateIds = $.isArray(templateIds) ? templateIds : [templateIds];
		for (var i = 0; i < templateIds.length; i++) {
			var id = templateIds[i];
			var html = $(document.getElementById(id)).html();
			if(html) {
				add(id, html);
			}
		}
	}

	/**
	 * Render a previously added template using a data object
	 *
	 * @param {String} template the template id of a previously added template
	 * @param {Object} view the data to use to render the template
	 * @returns {String} the rendered template
	 */
	function render(template, view) {
		if(!template in templateMap) {
			$.error('No template added with id: ' + template);
		}
		return Mustache.render(templateMap[template], view, templateMap);
	}

	/**
	 * Load template(s) using AJAX and add them for future use. Only finds elements that are <script type="text/html"> and has an id attribute
	 *
	 * @param url the url to the template
	 * @param onComplete optional callback after template is loaded
	 * @returns {Object} a jQuery deferred, same as returned by $.get, use it to set up callbacks
	 */
	function load(url, onComplete) {
		var jqxhr = $.get(url);
		jqxhr.done(function (templates) {
			addAlltemplatesInHtml(templates);
			if($.isFunction(onComplete)) {
				onComplete();
			}
		});
		return jqxhr;
	}

	function addAlltemplatesInHtml(html) {
		$(html).filter('script[type="text/html"][id]').each(function(i, el) {
			add(el.id, $(el).html());
		});
	}

	return $.Mustache;
}));



