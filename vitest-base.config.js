import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		browser: {
			locators: {
				testIdAttribute: 'data-po',
			},
		},
	},
});
