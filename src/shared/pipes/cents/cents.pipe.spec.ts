import { CentsPipe } from './cents.pipe';

describe(CentsPipe, () => {
	it.each([
		{ cents: 10200, text: '$102.00' },
		{ cents: 4, text: '$0.04' },
		{ cents: 10150, text: '$101.50' },
		{ cents: 10150.5, text: '$101.51' },
		{ cents: 123456789, text: '$1,234,567.89' },
		{ cents: null, text: '—' },
	])('should format $cents cents as $text', ({ cents, text }) => {
		expect(new CentsPipe().transform(cents)).toBe(text);
	});
});
