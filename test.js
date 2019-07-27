import fs from 'fs';
import test from 'ava';
import tempy from 'tempy';
import writeJsonFile from '.';

test('async', async t => {
	const tempFile = tempy.file();
	await writeJsonFile(tempFile, {foo: true}, {indent: 2});
	t.is(fs.readFileSync(tempFile, 'utf8'), '{\n  "foo": true\n}\n');
});

test('sync', t => {
	const tempFile = tempy.file();
	writeJsonFile.sync(tempFile, {foo: true}, {detectIndent: true, indent: 2});
	t.is(fs.readFileSync(tempFile, 'utf8'), '{\n  "foo": true\n}\n');
});

test('detect indent', async t => {
	const tempFile = tempy.file();
	await writeJsonFile(tempFile, {foo: true}, {indent: 2});
	await writeJsonFile(tempFile, {foo: true, bar: true, foobar: true}, {detectIndent: true});
	t.is(fs.readFileSync(tempFile, 'utf8'), '{\n  "foo": true,\n  "bar": true,\n  "foobar": true\n}\n');
});

test('detect indent synchronously', t => {
	const tempFile = tempy.file();
	writeJsonFile.sync(tempFile, {foo: true}, {indent: 2});
	writeJsonFile.sync(tempFile, {foo: true, bar: true, foobar: true}, {detectIndent: true});
	t.is(fs.readFileSync(tempFile, 'utf8'), '{\n  "foo": true,\n  "bar": true,\n  "foobar": true\n}\n');
});

test('fall back to default indent if file doesn\'t exist', async t => {
	const tempFile = tempy.file();
	await writeJsonFile(tempFile, {foo: true, bar: true, foobar: true}, {detectIndent: true});
	t.is(fs.readFileSync(tempFile, 'utf8'), '{\n\t"foo": true,\n\t"bar": true,\n\t"foobar": true\n}\n');
});

test('async - {sortKeys: true}', async t => {
	const tempFile = tempy.file();
	await writeJsonFile(tempFile, {c: true, b: true, a: true}, {sortKeys: true});
	t.is(fs.readFileSync(tempFile, 'utf8'), '{\n\t"a": true,\n\t"b": true,\n\t"c": true\n}\n');

	await writeJsonFile(tempFile, ['c', 'b', 'a'], {sortKeys: true});
	t.is(fs.readFileSync(tempFile, 'utf8'), '[\n\t"c",\n\t"b",\n\t"a"\n]\n');
});

test('async - {sortKeys: false}', async t => {
	const tempFile = tempy.file();
	await writeJsonFile(tempFile, {c: true, b: true, a: true}, {sortKeys: false});
	t.is(fs.readFileSync(tempFile, 'utf8'), '{\n\t"c": true,\n\t"b": true,\n\t"a": true\n}\n');
});

test('async - `replacer` option', async t => {
	const tempFile = tempy.file();
	await writeJsonFile(tempFile, {foo: true, bar: true}, {replacer: ['foo']});
	t.is(fs.readFileSync(tempFile, 'utf8'), '{\n\t"foo": true\n}\n');
});

test('sync - `replacer` option', t => {
	const tempFile = tempy.file();
	writeJsonFile.sync(tempFile, {foo: true, bar: true}, {replacer: ['foo']});
	t.is(fs.readFileSync(tempFile, 'utf8'), '{\n\t"foo": true\n}\n');
});

test('async - respect trailing new line at end of file', async t => {
	const tempFile = tempy.file();
	fs.writeFileSync(tempFile, JSON.stringify({foo: true}));
	await writeJsonFile(tempFile, {bar: true});
	t.is(fs.readFileSync(tempFile, 'utf8'), '{\n\t"bar": true\n}');
});

test('sync - respect trailing new line at end of file', t => {
	const tempFile = tempy.file();
	fs.writeFileSync(tempFile, JSON.stringify({foo: true}));
	writeJsonFile.sync(tempFile, {bar: true});
	t.is(fs.readFileSync(tempFile, 'utf8'), '{\n\t"bar": true\n}');
});
