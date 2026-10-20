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
	...kiforFsd,
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
