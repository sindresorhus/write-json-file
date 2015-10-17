import path from 'path';
import fs from 'fs';
import test from 'ava';
import tempfile from 'tempfile';
import fn from './';

test('async', async t => {
	const tmp = path.join(tempfile(), 'foo');

	await fn(tmp, {foo: true}, {indent: 2});

	t.is(fs.readFileSync(tmp, 'utf8'), '{\n  "foo": true\n}\n');
});

test('sync', t => {
	var tmp = path.join(tempfile(), 'foo');

	fn.sync(tmp, {foo: true}, {indent: 2});

	t.is(fs.readFileSync(tmp, 'utf8'), '{\n  "foo": true\n}\n');
	t.end();
});
