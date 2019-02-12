export type Replacer = (this: unknown, key: string, value: unknown) => unknown;
export type SortKeys = (a: string, b: string) => number;
export type JSONStringifyable = string | number | boolean | null | object;

export interface Options {
	/**
	 * Indentation as a string or number of spaces. Pass in null for no formatting.
	 *
	 * @default '\t'
	 */
	readonly indent?: string | number | null;

	/**
	 * Detect indentation automatically if the file exists.
	 *
	 * @default false
	 */
	readonly detectIndent?: boolean;

	/**
	 * Sort the keys recursively. Optionally pass in a compare function.
	 *
	 * @default false
	 */
	readonly sortKeys?: boolean | SortKeys;

	/**
	 * Passed into `JSON.stringify`.
	 */
	readonly replacer?: Replacer | Array<number | string>;

	/**
	 * Mode used when writing the file.
	 *
	 * @default 0o666
	 */
	readonly mode?: number;
}

/**
 * Stringify and write JSON to a file atomically.
 *
 * Creates directories for you as needed.
 *
 * @example
 *
 * import * as writeJsonFile from 'write-json-file';
 *
 * writeJsonFile.sync('foo.json', {foo: true});
 */
export function sync(filepath: string, data: JSONStringifyable, options?: Options): void;

/**
 * Stringify and write JSON to a file atomically.
 *
 * Creates directories for you as needed.
 *
 * @example
 *
 * import writeJsonFile from 'write-json-file';
 *
 * (async () => {
 * 	await writeJsonFile('foo.json', {foo: true});
 * })();
 */
export default function writeJsonFile(filepath: string, data: JSONStringifyable, options?: Options): Promise<void>;
