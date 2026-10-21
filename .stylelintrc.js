import kiforConfig from '@kiforks/stylelint-config';

const {
	rules: { 'declaration-property-unit-allowed-list': propertyUnits, 'unit-allowed-list': units },
} = kiforConfig;

/** @type {import('stylelint').Config} */
export default {
	extends: [kiforConfig],
	rules: {
		'declaration-property-unit-allowed-list': {
			...propertyUnits,
			'min-height': [...propertyUnits['min-height'], 'dvh'],
		},
		'unit-allowed-list': [...units, 'dvh'],
	},
};
