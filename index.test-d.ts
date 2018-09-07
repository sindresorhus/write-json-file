import {expectType} from 'tsd-check';
import writeJsonFile, {sync, Replacer, SortKeys, JSONStringifyable} from '.';

expectType<JSONStringifyable>('🦄');
expectType<JSONStringifyable>(1);
expectType<JSONStringifyable>(true);
expectType<JSONStringifyable>(new Date());
expectType<JSONStringifyable>(['hello', 'world']);
expectType<JSONStringifyable>({unicorn: '🦄'});

expectType<SortKeys>(() => 1);
expectType<SortKeys>((a: string) => a.length);
expectType<SortKeys>((a: string, b: string) => a.length - b.length);

expectType<Replacer>(() => 1);
expectType<Replacer>(() => 'unicorn');
expectType<Replacer>(() => true);
expectType<Replacer>(() => null);
expectType<Replacer>(() => undefined);
expectType<Replacer>(() => ({unicorn: '🦄'}));
expectType<Replacer>(() => ['unicorn', 1]);
expectType<Replacer>(() => () => 'foo');
expectType<Replacer>((key: string) => key.toUpperCase());
expectType<Replacer>((key: string, value: string) => (key + value).toUpperCase());

expectType<void>(await writeJsonFile('unicorn.json', {unicorn: '🦄'}));
expectType<void>(await writeJsonFile('unicorn.json', '🦄'));
expectType<void>(await writeJsonFile('date.json', new Date()));
expectType<void>(await writeJsonFile('unicorn.json', {unicorn: '🦄'}, {detectIndent: true}));
expectType<void>(await writeJsonFile('unicorn.json', {unicorn: '🦄'}, {indent: ' '}));
expectType<void>(await writeJsonFile('unicorn.json', {unicorn: '🦄'}, {indent: 4}));
expectType<void>(await writeJsonFile('unicorn.json', {unicorn: '🦄'}, {mode: 0o666}));
expectType<void>(await writeJsonFile('unicorn.json', {unicorn: '🦄'}, {replacer: ['unicorn', 1]}));
expectType<void>(await writeJsonFile('unicorn.json', {unicorn: '🦄'}, {replacer: () => 'unicorn'}));
expectType<void>(await writeJsonFile('unicorn.json', {unicorn: '🦄'}, {sortKeys: () => -1}));
expectType<void>(await writeJsonFile('unicorn.json', {unicorn: '🦄'}, {sortKeys: (a: string, b: string) => a.length - b.length}));
expectType<void>(await writeJsonFile('unicorn.json', {unicorn: '🦄'}, {sortKeys: true}));

expectType<void>(sync('unicorn.json', {unicorn: '🦄'}));
expectType<void>(sync('unicorn.json', '🦄'));
expectType<void>(sync('date.json', new Date()));
expectType<void>(sync('unicorn.json', {unicorn: '🦄'}, {detectIndent: true}));
expectType<void>(sync('unicorn.json', {unicorn: '🦄'}, {indent: ' '}));
expectType<void>(sync('unicorn.json', {unicorn: '🦄'}, {indent: 4}));
expectType<void>(sync('unicorn.json', {unicorn: '🦄'}, {mode: 0o666}));
expectType<void>(sync('unicorn.json', {unicorn: '🦄'}, {replacer: ['unicorn', 1]}));
expectType<void>(sync('unicorn.json', {unicorn: '🦄'}, {replacer: () => 'unicorn'}));
expectType<void>(sync('unicorn.json', {unicorn: '🦄'}, {sortKeys: () => -1}));
expectType<void>(sync('unicorn.json', {unicorn: '🦄'}, {sortKeys: (a: string, b: string) => a.length - b.length}));
expectType<void>(sync('unicorn.json', {unicorn: '🦄'}, {sortKeys: true}));
