import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';

import { IntegerRangeValidator } from './integer-range.validator';

describe(IntegerRangeValidator, () => {
	describe('apply', () => {
		it.each([
			{ kinds: ['required'], value: null },
			{ kinds: ['min'], value: 0 },
			{ kinds: ['max'], value: 51 },
			{ kinds: ['integer'], value: 2.5 },
			{ kinds: [], value: 1 },
			{ kinds: [], value: 50 },
		])('should report $kinds for $value in the range from 1 to 50', ({ kinds, value }) => {
			const countForm = TestBed.runInInjectionContext(() =>
				form(signal<{ count: number | null }>({ count: value }), ({ count }) => {
					IntegerRangeValidator.apply(count, { max: 50, min: 1 });
				})
			);
			const reportedKinds = countForm
				.count()
				.errors()
				.map(({ kind }) => kind);

			expect(reportedKinds).toStrictEqual(kinds);
		});
	});

	describe('isWhole', () => {
		it.each([
			{ isWhole: true, value: 3 },
			{ isWhole: true, value: null },
			{ isWhole: false, value: 0.5 },
		])('should report $isWhole for $value', ({ isWhole, value }) => {
			expect(IntegerRangeValidator.isWhole(value)).toBe(isWhole);
		});
	});
});
