type Replacer = (key: string, value: any) => void;

interface Options {
	indent?: string | number | null;
	detectIndent?: boolean;
	sortKeys?: boolean | ((a: string, b: string) => number);
	replacer?: Replacer | Array<number | string> | null;
	mode?: number;
}

/**
 * Stringify and write JSON to a file atomically
 *
 * Creates directories for you as needed.
 *
 * @param {string} filepath Filepath
 * @param {any} data Data
 * @param {object} [options] Optional parameters
 * @param {string|number|null} [options.indent='\t'] Indentation as a string or number of spaces. Pass in null for no formatting.
 * @param {boolean} [options.detectIndent=false] Detect indentation automatically if the file exists.
 * @param {boolean|function} [options.sortKeys=false] Sort the keys recursively. Optionally pass in a compare function.
 * @param {function|Array<number|string>|null} [options.replacer] Passed into JSON.stringify.
 * @param {number} [options.mode=0o666] Mode used when writing the file.
 * @returns {void}
 * @example
 * const writeJsonFile = require('write-json-file');
 *
 * writeJsonFile.sync('foo.json', {foo: true});
 * console.log('done');
 */
export function sync(filepath: string, data: any, options?: Options): void;

/**
 * Stringify and write JSON to a file atomically
 *
 * Creates directories for you as needed.
 *
 * @param {string} filepath Filepath
 * @param {any} data Data
 * @param {object} [options] Optional parameters
 * @param {string|number|null} [options.indent='\t'] Indentation as a string or number of spaces. Pass in null for no formatting.
 * @param {boolean} [options.detectIndent=false] Detect indentation automatically if the file exists.
 * @param {boolean|function} [options.sortKeys=false] Sort the keys recursively. Optionally pass in a compare function.
 * @param {function|Array<number|string>|null} [options.replacer] Passed into JSON.stringify.
 * @param {number} [options.mode=0o666] Mode used when writing the file.
 * @returns {Promise<void>}
 * @example
 * const writeJsonFile = require('write-json-file');
 *
 * writeJsonFile('foo.json', {foo: true}).then(() => {
 * 	console.log('done');
 * });
 */
export default function writeJsonFile(filepath: string, data: any, options?: Options): Promise<void>;
