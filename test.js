import fs from 'node:fs';
import test from 'ava';
import tempy from 'tempy';
import {writeJsonFile, writeJsonFileSync} from './index.js';

test('async', async t => {
	const temporaryFile = tempy.file();
	await writeJsonFile(temporaryFile, {foo: true}, {indent: 2});
	t.is(fs.readFileSync(temporaryFile, 'utf8'), '{\n  "foo": true\n}\n');
});

test('sync', t => {
	const temporaryFile = tempy.file();
	writeJsonFileSync(temporaryFile, {foo: true}, {detectIndent: true, indent: 2});
	t.is(fs.readFileSync(temporaryFile, 'utf8'), '{\n  "foo": true\n}\n');
});

test('detect indent', async t => {
	const temporaryFile = tempy.file();
	await writeJsonFile(temporaryFile, {foo: true}, {indent: 2});
	await writeJsonFile(temporaryFile, {foo: true, bar: true, foobar: true}, {detectIndent: true});
	t.is(fs.readFileSync(temporaryFile, 'utf8'), '{\n  "foo": true,\n  "bar": true,\n  "foobar": true\n}\n');
});

test('detect indent synchronously', t => {
	const temporaryFile = tempy.file();
	writeJsonFileSync(temporaryFile, {foo: true}, {indent: 2});
	writeJsonFileSync(temporaryFile, {foo: true, bar: true, foobar: true}, {detectIndent: true});
	t.is(fs.readFileSync(temporaryFile, 'utf8'), '{\n  "foo": true,\n  "bar": true,\n  "foobar": true\n}\n');
});

test('fall back to default indent if file doesn\'t exist', async t => {
	const temporaryFile = tempy.file();
	await writeJsonFile(temporaryFile, {foo: true, bar: true, foobar: true}, {detectIndent: true});
	t.is(fs.readFileSync(temporaryFile, 'utf8'), '{\n\t"foo": true,\n\t"bar": true,\n\t"foobar": true\n}\n');
});

test('async - {sortKeys: true}', async t => {
	const temporaryFile = tempy.file();
	await writeJsonFile(temporaryFile, {c: true, b: true, a: true}, {sortKeys: true});
	t.is(fs.readFileSync(temporaryFile, 'utf8'), '{\n\t"a": true,\n\t"b": true,\n\t"c": true\n}\n');

	await writeJsonFile(temporaryFile, ['c', 'b', 'a'], {sortKeys: true});
	t.is(fs.readFileSync(temporaryFile, 'utf8'), '[\n\t"c",\n\t"b",\n\t"a"\n]\n');
});

test('async - {sortKeys: false}', async t => {
	const temporaryFile = tempy.file();
	await writeJsonFile(temporaryFile, {c: true, b: true, a: true}, {sortKeys: false});
	t.is(fs.readFileSync(temporaryFile, 'utf8'), '{\n\t"c": true,\n\t"b": true,\n\t"a": true\n}\n');
});

test('async - `replacer` option', async t => {
	const temporaryFile = tempy.file();
	await writeJsonFile(temporaryFile, {foo: true, bar: true}, {replacer: ['foo']});
	t.is(fs.readFileSync(temporaryFile, 'utf8'), '{\n\t"foo": true\n}\n');
});

test('sync - `replacer` option', t => {
	const temporaryFile = tempy.file();
	writeJsonFileSync(temporaryFile, {foo: true, bar: true}, {replacer: ['foo']});
	t.is(fs.readFileSync(temporaryFile, 'utf8'), '{\n\t"foo": true\n}\n');
});

test('async - respect trailing newline at the end of the file', async t => {
	const temporaryFile = tempy.file();
	fs.writeFileSync(temporaryFile, JSON.stringify({foo: true}));
	await writeJsonFile(temporaryFile, {bar: true});
	t.is(fs.readFileSync(temporaryFile, 'utf8'), '{\n\t"bar": true\n}');
});

test('sync - respect trailing newline at the end of the file', t => {
	const temporaryFile = tempy.file();
	fs.writeFileSync(temporaryFile, JSON.stringify({foo: true}));
	writeJsonFileSync(temporaryFile, {bar: true});
	t.is(fs.readFileSync(temporaryFile, 'utf8'), '{\n\t"bar": true\n}');
});
