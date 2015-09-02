'use strict';
var writeFileAtomic = require('write-file-atomic');
var sortKeys = require('sort-keys');
var objectAssign = require('object-assign');
var Promise = require('pinkie-promise');
var pify = require('pify');

function main(fn, fp, data, opts) {
	opts = objectAssign({
		indent: '\t',
		sortKeys: false
	}, opts);

	if (opts.sortKeys) {
		data = sortKeys(data, {
			deep: true,
			compare: typeof opts.sortKeys === 'function' && opts.sortKeys
		});
	}

	var json = JSON.stringify(data, opts.replacer, opts.indent) + '\n';

	return fn(fp, json, {mode: opts.mode});
}

module.exports = main.bind(null, pify(writeFileAtomic, Promise));
module.exports.sync = main.bind(null, writeFileAtomic.sync);
