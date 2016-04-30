'use strict';
const path = require('path');
const fs = require('graceful-fs');
const writeFileAtomic = require('write-file-atomic');
const sortKeys = require('sort-keys');
const mkdirp = require('mkdirp');
const pify = require('pify');

const main = (fn, fp, data, opts) => {
	if (!fp) {
		throw new TypeError('Expected a filepath');
	}

	if (data === undefined) {
		throw new TypeError('Expected data to stringify');
	}

	opts = Object.assign({
		indent: '\t',
		sortKeys: false
	}, opts);

	if (opts.sortKeys) {
		data = sortKeys(data, {
			deep: true,
			compare: typeof opts.sortKeys === 'function' && opts.sortKeys
		});
	}

	const json = JSON.stringify(data, opts.replacer, opts.indent);

	return fn(fp, `${json}\n`, {mode: opts.mode});
};

module.exports = (fp, data, opts) =>
	pify(mkdirp)(path.dirname(fp), {fs})
		.then(() => main(pify(writeFileAtomic), fp, data, opts));

module.exports.sync = (fp, data, opts) => {
	mkdirp.sync(path.dirname(fp), {fs});
	main(writeFileAtomic.sync, fp, data, opts);
};
