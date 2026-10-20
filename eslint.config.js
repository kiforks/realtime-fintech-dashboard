import kiforAngularTemplate from '@kiforks/eslint-config/angular-template.js';
import kiforAngularTypescript from '@kiforks/eslint-config/angular-typescript.js';
import kiforDisableRecommend from '@kiforks/eslint-config/disable-recommend.js';
import kiforFsd from '@kiforks/eslint-config/feature-sliced-design.js';
import kiforJavascript from '@kiforks/eslint-config/javascript.js';
import kiforTests from '@kiforks/eslint-config/test.js';
import kiforTypescript from '@kiforks/eslint-config/typescript.js';
import kiforVitest from '@kiforks/eslint-config/vitest.js';

const I18N_RULE = '@angular-eslint/template/i18n';
const NON_TRANSLATABLE_ATTRIBUTES = ['aria-describedby', 'aria-labelledby', 'ariaCurrentWhenActive'];

const withNonTranslatableAttributes = config => {
	const i18nRule = config.rules?.[I18N_RULE];
	const hasIgnoredAttributes = Array.isArray(i18nRule) && Array.isArray(i18nRule.at(1)?.ignoreAttributes);

	if (!hasIgnoredAttributes) {
		return config;
	}

	const [severity, options] = i18nRule;

	return {
		...config,
		rules: {
			...config.rules,
			[I18N_RULE]: [
				severity,
				{ ...options, ignoreAttributes: [...options.ignoreAttributes, ...NON_TRANSLATABLE_ATTRIBUTES] },
			],
		},
	};
};

const RESTRICTED_IMPORTS_RULE = 'no-restricted-imports';
const APP_LAYER_FILES = '**/app/**/*.{ts,tsx,js,jsx}';
const PUBLIC_API_PATTERNS = [
	{
		group: ['~/entities/*/*', '!~/entities/*/testing', '~/pages/*/*', '!~/pages/*/testing'],
		message: '❌ Import a slice only through its public API: index.ts, or testing.ts in tests.',
	},
	{
		group: ['~/shared/*/*'],
		message: '❌ Import a shared segment only through its index.ts.',
	},
];
const SLICE_ISOLATION_PATTERNS = {
	entities: {
		group: ['~/entities/*'],
		message: '❌ An entity must not import another entity; inside a slice use relative imports.',
	},
	pages: {
		group: ['~/pages/*'],
		message: '❌ A page must not import another page; inside a slice use relative imports.',
	},
};

const withSliceBoundaries = config => {
	const restrictedImports = config.rules?.[RESTRICTED_IMPORTS_RULE];

	if (!Array.isArray(restrictedImports)) {
		return config;
	}

	const [severity, options] = restrictedImports;
	const layer = config.files.at(0).split('/').at(1);
	const isolationPatterns = layer in SLICE_ISOLATION_PATTERNS ? [SLICE_ISOLATION_PATTERNS[layer]] : [];

	return {
		...config,
		rules: {
			...config.rules,
			[RESTRICTED_IMPORTS_RULE]: [
				severity,
				{ ...options, patterns: [...options.patterns, ...PUBLIC_API_PATTERNS, ...isolationPatterns] },
			],
		},
	};
};

/** @type { import("eslint").Linter.Config[] } */
export default [
	...kiforJavascript,
	...kiforTypescript.map(config => ({
		...config,
		rules: {
			...config.rules,
			'@typescript-eslint/prefer-nullish-coalescing': ['error', { ignoreBooleanCoercion: true }],
			'@typescript-eslint/explicit-module-boundary-types': 'off',
		},
		languageOptions: {
			...config.languageOptions,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	})),
	kiforDisableRecommend,
	...kiforAngularTypescript,
	...kiforAngularTemplate.map(withNonTranslatableAttributes),
	...kiforVitest,
	...kiforTests,
	{
		files: ['**/*.spec.ts'],
		rules: {
			'vitest/prefer-expect-resolves': 'off',
		},
	},
	...kiforFsd.map(withSliceBoundaries),
	{
		files: [APP_LAYER_FILES],
		rules: {
			[RESTRICTED_IMPORTS_RULE]: ['error', { patterns: PUBLIC_API_PATTERNS }],
		},
	},
	{
		ignores: [
			'src/app/index.html',
			'wasm/',
			'dist/',
			'out-tsc/',
			'coverage/',
			'.angular/',
			'node_modules/',
			'.vscode/',
			'.idea/',
		],
	},
];
