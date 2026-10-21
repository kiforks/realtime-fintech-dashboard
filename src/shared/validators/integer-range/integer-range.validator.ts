import { max, min, required, SchemaPath, validate } from '@angular/forms/signals';

import { IntegerRange } from '../../models';

export abstract class IntegerRangeValidator {
	public static apply(path: SchemaPath<number | null>, { max: maxValue, min: minValue }: IntegerRange): void {
		required(path);
		min(path, minValue);
		max(path, maxValue);
		validate(path, ({ value }) => (IntegerRangeValidator.isWhole(value()) ? null : { kind: 'integer' }));
	}

	public static isWhole(value: number | null): boolean {
		return value === null || Number.isInteger(value);
	}
}
