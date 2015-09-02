'use strict';
var path = require('path');
var fs = require('fs');
var test = require('ava');
var tempfile = require('tempfile');
var fn = require('./');

test('async', function (t) {
	var tmp = path.join(tempfile(), 'foo');

	return fn(tmp, {foo: true}, {indent: 2}).then(function () {
		t.is(fs.readFileSync(tmp, 'utf8'), '{\n  "foo": true\n}\n');
	});
});

test('sync', function (t) {
	var tmp = path.join(tempfile(), 'foo');

	fn.sync(tmp, {foo: true}, {indent: 2});

	t.is(fs.readFileSync(tmp, 'utf8'), '{\n  "foo": true\n}\n');
	t.end();
});
