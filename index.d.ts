export type Replacer = (key: string, value: any) => number | string | boolean | object | null | undefined;
export type SortKeys = (a: string, b: string) => number;
export type JSONStringifyable = object | number | string | boolean;

export interface Options {
	/**
	 * Indentation as a string or number of spaces. Pass in null for no formatting.
	 *
	 * @default '\t'
	 */
	indent?: string | number | null;
	/**
	 * Detect indentation automatically if the file exists.
	 *
	 * @default false
	 */
	detectIndent?: boolean;
	/**
	 * Sort the keys recursively. Optionally pass in a compare function.
	 *
	 * @default false
	 */
	sortKeys?: boolean | SortKeys;
	/**
	 * Passed into `JSON.stringify`.
	 */
	replacer?: Replacer | Array<number | string>;
	/**
	 * Mode used when writing the file.
	 *
	 * @default 0o666
	 */
	mode?: number;
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
