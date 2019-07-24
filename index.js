'use strict';
const {promisify} = require('util');
const path = require('path');
const fs = require('graceful-fs');
const writeFileAtomic = require('write-file-atomic');
const sortKeys = require('sort-keys');
const makeDir = require('make-dir');
const detectIndent = require('detect-indent');
const isPlainObj = require('is-plain-obj');

const readFile = promisify(fs.readFile);

const detectEOF = file => {
	const detected = file.match(/\r?\n$/);
	return detected ? detected[0] : '';
};

const init = (fn, filePath, data, options) => {
	if (!filePath) {
		throw new TypeError('Expected a filepath');
	}

	if (data === undefined) {
		throw new TypeError('Expected data to stringify');
	}

	options = {
		indent: '\t',
		sortKeys: false,
		...options
	};

	if (options.sortKeys && isPlainObj(data)) {
		data = sortKeys(data, {
			deep: true,
			compare: typeof options.sortKeys === 'function' ? options.sortKeys : undefined
		});
	}

	return fn(filePath, data, options);
};

const main = async (filePath, data, options) => {
	let {indent} = options;
	let EOF = '\n';
	try {
		const file = await readFile(filePath, 'utf8');
		EOF = detectEOF(file);
		if (options.detectIndent) {
			indent = detectIndent(file).indent;
		}
	} catch (error) {
		if (error.code !== 'ENOENT') {
			throw error;
		}
	}

	const json = JSON.stringify(data, options.replacer, indent);

	return writeFileAtomic(filePath, `${json}${EOF}`, {mode: options.mode});
};

const mainSync = (filePath, data, options) => {
	let {indent} = options;
	let EOF = '\n';
	try {
		const file = fs.readFileSync(filePath, 'utf8');
		EOF = detectEOF(file);
		if (options.detectIndent) {
			indent = detectIndent(file).indent;
		}
	} catch (error) {
		if (error.code !== 'ENOENT') {
			throw error;
		}
	}

	const json = JSON.stringify(data, options.replacer, indent);

	return writeFileAtomic.sync(filePath, `${json}${EOF}`, {mode: options.mode});
};

module.exports = async (filePath, data, options) => {
	await makeDir(path.dirname(filePath), {fs});
	return init(main, filePath, data, options);
};

module.exports.sync = (filePath, data, options) => {
	makeDir.sync(path.dirname(filePath), {fs});
	init(mainSync, filePath, data, options);
};
