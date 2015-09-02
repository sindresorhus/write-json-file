'use strict';
var fs = require('fs');
var test = require('ava');
var tempfile = require('tempfile');
var fn = require('./');

test('async', function (t) {
	var tmp = tempfile();

	return fn(tmp, {foo: true}, {indent: 2}).then(function () {
		t.is(fs.readFileSync(tmp, 'utf8'), '{\n  "foo": true\n}\n');
	});
});

test('sync', function (t) {
	var tmp = tempfile();

	fn.sync(tmp, {foo: true}, {indent: 2});

	t.is(fs.readFileSync(tmp, 'utf8'), '{\n  "foo": true\n}\n');
	t.end();
});
