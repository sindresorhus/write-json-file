import {expectType, expectAssignable} from 'tsd';
import {writeJsonFile, writeJsonFileSync, Replacer, SortKeys} from './index.js';

expectAssignable<SortKeys>(() => 1);
expectAssignable<SortKeys>((a: string) => a.length);
expectAssignable<SortKeys>((a: string, b: string) => a.length - b.length);

expectAssignable<Replacer>(() => 1);
expectAssignable<Replacer>(() => 'unicorn');
expectAssignable<Replacer>(() => true);
expectAssignable<Replacer>(() => null);
expectAssignable<Replacer>(() => undefined);
expectAssignable<Replacer>(() => ({unicorn: '🦄'}));
expectAssignable<Replacer>(() => ['unicorn', 1]);
expectAssignable<Replacer>(() => () => 'foo');
expectAssignable<Replacer>((key: string) => key.toUpperCase());
expectAssignable<Replacer>((key: string, value: unknown) => (key + (value as string)).toUpperCase());

expectType<Promise<void>>(writeJsonFile('unicorn.json', {unicorn: '🦄'}));
expectType<Promise<void>>(writeJsonFile('unicorn.json', '🦄'));
expectType<Promise<void>>(writeJsonFile('date.json', new Date()));
expectType<Promise<void>>(writeJsonFile('unicorn.json', {unicorn: '🦄'}, {detectIndent: true}));
expectType<Promise<void>>(writeJsonFile('unicorn.json', {unicorn: '🦄'}, {indent: ' '}));
expectType<Promise<void>>(writeJsonFile('unicorn.json', {unicorn: '🦄'}, {indent: 4}));
expectType<Promise<void>>(writeJsonFile('unicorn.json', {unicorn: '🦄'}, {mode: 0o666}));
expectType<Promise<void>>(writeJsonFile('unicorn.json', {unicorn: '🦄'}, {replacer: ['unicorn', 1]}));
expectType<Promise<void>>(writeJsonFile('unicorn.json', {unicorn: '🦄'}, {replacer: () => 'unicorn'}));
expectType<Promise<void>>(writeJsonFile('unicorn.json', {unicorn: '🦄'}, {sortKeys: () => -1}));
expectType<Promise<void>>(writeJsonFile('unicorn.json', {unicorn: '🦄'}, {sortKeys: (a: string, b: string) => a.length - b.length}));
expectType<Promise<void>>(writeJsonFile('unicorn.json', {unicorn: '🦄'}, {sortKeys: true}));

expectType<void>(writeJsonFileSync('unicorn.json', {unicorn: '🦄'}));
expectType<void>(writeJsonFileSync('unicorn.json', '🦄'));
expectType<void>(writeJsonFileSync('date.json', new Date()));
expectType<void>(writeJsonFileSync('unicorn.json', {unicorn: '🦄'}, {detectIndent: true}));
expectType<void>(writeJsonFileSync('unicorn.json', {unicorn: '🦄'}, {indent: ' '}));
expectType<void>(writeJsonFileSync('unicorn.json', {unicorn: '🦄'}, {indent: 4}));
expectType<void>(writeJsonFileSync('unicorn.json', {unicorn: '🦄'}, {mode: 0o666}));
expectType<void>(writeJsonFileSync('unicorn.json', {unicorn: '🦄'}, {replacer: ['unicorn', 1]}));
expectType<void>(writeJsonFileSync('unicorn.json', {unicorn: '🦄'}, {replacer: () => 'unicorn'}));
expectType<void>(writeJsonFileSync('unicorn.json', {unicorn: '🦄'}, {sortKeys: () => -1}));
expectType<void>(writeJsonFileSync('unicorn.json', {unicorn: '🦄'}, {sortKeys: (a: string, b: string) => a.length - b.length}));
expectType<void>(writeJsonFileSync('unicorn.json', {unicorn: '🦄'}, {sortKeys: true}));
