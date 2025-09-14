import fs, {promises as fsPromises} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {setTimeout as delay} from 'node:timers/promises';
import {tmpdir} from 'node:os';
import {writeJsonFile, writeJsonFileSync} from './index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function temporaryFile() {
	return path.join(tmpdir(), `write-json-file-test-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
}

test('async', async () => {
	const temporaryFilePath = temporaryFile();
	await writeJsonFile(temporaryFilePath, {foo: true}, {indent: 2});
	assert.equal(fs.readFileSync(temporaryFilePath, 'utf8'), '{\n  "foo": true\n}\n');
	fs.unlinkSync(temporaryFilePath);
});

test('sync', () => {
	const temporaryFilePath = temporaryFile();
	writeJsonFileSync(temporaryFilePath, {foo: true}, {detectIndent: true, indent: 2});
	assert.equal(fs.readFileSync(temporaryFilePath, 'utf8'), '{\n  "foo": true\n}\n');
	fs.unlinkSync(temporaryFilePath);
});

test('detect indent', async () => {
	const temporaryFilePath = temporaryFile();
	await writeJsonFile(temporaryFilePath, {foo: true}, {indent: 2});
	await writeJsonFile(temporaryFilePath, {foo: true, bar: true, foobar: true}, {detectIndent: true});
	assert.equal(fs.readFileSync(temporaryFilePath, 'utf8'), '{\n  "foo": true,\n  "bar": true,\n  "foobar": true\n}\n');
	fs.unlinkSync(temporaryFilePath);
});

test('detect indent synchronously', () => {
	const temporaryFilePath = temporaryFile();
	writeJsonFileSync(temporaryFilePath, {foo: true}, {indent: 2});
	writeJsonFileSync(temporaryFilePath, {foo: true, bar: true, foobar: true}, {detectIndent: true});
	assert.equal(fs.readFileSync(temporaryFilePath, 'utf8'), '{\n  "foo": true,\n  "bar": true,\n  "foobar": true\n}\n');
	fs.unlinkSync(temporaryFilePath);
});

test('fall back to default indent if file doesn\'t exist', async () => {
	const temporaryFilePath = temporaryFile();
	await writeJsonFile(temporaryFilePath, {foo: true, bar: true, foobar: true}, {detectIndent: true});
	assert.equal(fs.readFileSync(temporaryFilePath, 'utf8'), '{\n\t"foo": true,\n\t"bar": true,\n\t"foobar": true\n}\n');
	fs.unlinkSync(temporaryFilePath);
});

test('async - {sortKeys: true}', async () => {
	const temporaryFilePath = temporaryFile();
	await writeJsonFile(temporaryFilePath, {c: true, b: true, a: true}, {sortKeys: true});
	assert.equal(fs.readFileSync(temporaryFilePath, 'utf8'), '{\n\t"a": true,\n\t"b": true,\n\t"c": true\n}\n');

	await writeJsonFile(temporaryFilePath, ['c', 'b', 'a'], {sortKeys: true});
	assert.equal(fs.readFileSync(temporaryFilePath, 'utf8'), '[\n\t"c",\n\t"b",\n\t"a"\n]\n');
	fs.unlinkSync(temporaryFilePath);
});

test('async - {sortKeys: false}', async () => {
	const temporaryFilePath = temporaryFile();
	await writeJsonFile(temporaryFilePath, {c: true, b: true, a: true}, {sortKeys: false});
	assert.equal(fs.readFileSync(temporaryFilePath, 'utf8'), '{\n\t"c": true,\n\t"b": true,\n\t"a": true\n}\n');
	fs.unlinkSync(temporaryFilePath);
});

test('async - `replacer` option', async () => {
	const temporaryFilePath = temporaryFile();
	await writeJsonFile(temporaryFilePath, {foo: true, bar: true}, {replacer: ['foo']});
	assert.equal(fs.readFileSync(temporaryFilePath, 'utf8'), '{\n\t"foo": true\n}\n');
	fs.unlinkSync(temporaryFilePath);
});

test('sync - `replacer` option', () => {
	const temporaryFilePath = temporaryFile();
	writeJsonFileSync(temporaryFilePath, {foo: true, bar: true}, {replacer: ['foo']});
	assert.equal(fs.readFileSync(temporaryFilePath, 'utf8'), '{\n\t"foo": true\n}\n');
	fs.unlinkSync(temporaryFilePath);
});

test('async - respect trailing newline at the end of the file', async () => {
	const temporaryFilePath = temporaryFile();
	fs.writeFileSync(temporaryFilePath, JSON.stringify({foo: true}));
	await writeJsonFile(temporaryFilePath, {bar: true});
	assert.equal(fs.readFileSync(temporaryFilePath, 'utf8'), '{\n\t"bar": true\n}');
	fs.unlinkSync(temporaryFilePath);
});

test('sync - respect trailing newline at the end of the file', () => {
	const temporaryFilePath = temporaryFile();
	fs.writeFileSync(temporaryFilePath, JSON.stringify({foo: true}));
	writeJsonFileSync(temporaryFilePath, {bar: true});
	assert.equal(fs.readFileSync(temporaryFilePath, 'utf8'), '{\n\t"bar": true\n}');
	fs.unlinkSync(temporaryFilePath);
});

test('concurrent writes', async () => {
	/* eslint-disable no-await-in-loop */
	const testDir = path.join(__dirname, 'test-temp-concurrent');
	const targetFile = path.join(testDir, 'concurrent-test.json');
	const sourceFile = path.join(testDir, 'source.json');

	await fsPromises.rm(testDir, {recursive: true, force: true});
	await fsPromises.mkdir(testDir, {recursive: true});

	await fsPromises.writeFile(sourceFile, JSON.stringify({test: 'data', value: 1}));

	const errors = [];
	let successCount = 0;

	async function worker(id) {
		for (let index = 0; index < 100; index++) {
			try {
				const data = JSON.parse(await fsPromises.readFile(sourceFile, 'utf8'));
				data.worker = id;
				data.iteration = index;
				await writeJsonFile(targetFile, data);
				successCount++;
			} catch (error) {
				errors.push({
					worker: id, iteration: index, error: error.message, code: error.code,
				});
			}

			await delay(Math.random() * 10);
		}
	}

	const workers = [];
	for (let index = 0; index < 5; index++) {
		workers.push(worker(index));
	}

	await Promise.all(workers);

	assert.equal(successCount, 500, `Expected 500 successful writes, got ${successCount}`);
	assert.equal(errors.length, 0, `Expected no errors, got ${errors.length}`);

	await fsPromises.rm(testDir, {recursive: true, force: true});
	/* eslint-enable no-await-in-loop */
});

test('aggressive concurrent writes', async () => {
	/* eslint-disable no-await-in-loop */
	const testDir = path.join(__dirname, 'test-temp-aggressive');
	const sourceFile = path.join(testDir, 'bar.json');
	const targetFile = path.join(testDir, 'foo.json');

	await fsPromises.rm(testDir, {recursive: true, force: true});
	await fsPromises.mkdir(testDir, {recursive: true});

	await fsPromises.writeFile(sourceFile, JSON.stringify({test: 'data', value: 1}));

	let errorCount = 0;
	let successCount = 0;
	const maxIterations = 100;

	async function run() {
		await delay(10);
		const file = await fsPromises.readFile(sourceFile, 'utf8');
		const data = JSON.parse(file);
		await writeJsonFile(targetFile, data);
	}

	async function worker() {
		for (let index = 0; index < maxIterations; index++) {
			try {
				await run();
				successCount++;
			} catch {
				errorCount++;
			}
		}
	}

	const workers = [];
	for (let index = 0; index < 3; index++) {
		workers.push(worker());
	}

	await Promise.all(workers);

	assert.equal(successCount, maxIterations * 3, `Expected ${maxIterations * 3} successful writes, got ${successCount}`);
	assert.equal(errorCount, 0, `Expected no errors, got ${errorCount}`);

	await fsPromises.rm(testDir, {recursive: true, force: true});
	/* eslint-enable no-await-in-loop */
});
