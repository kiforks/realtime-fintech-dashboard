import { SignedRatioPipe } from './signed-ratio.pipe';

describe(SignedRatioPipe, () => {
	it.each([
		{ ratio: 0.2, text: '+0.20' },
		{ ratio: -0.35, text: '-0.35' },
		{ ratio: 1, text: '+1.00' },
		{ ratio: -1, text: '-1.00' },
		{ ratio: 0, text: '0.00' },
		{ ratio: null, text: '—' },
	])('should format the ratio $ratio as $text', ({ ratio, text }) => {
		expect(new SignedRatioPipe().transform(ratio)).toBe(text);
	});
});
