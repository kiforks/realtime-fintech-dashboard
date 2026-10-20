import { Pipe, PipeTransform } from '@angular/core';

import { NumberFormatConfig } from '../../configs';

@Pipe({ name: 'cents' })
export class CentsPipe implements PipeTransform {
	public transform(cents: number | null): string {
		return CentsPipe.transform(cents);
	}

	public static transform(cents: number | null): string {
		return cents === null
			? NumberFormatConfig.unavailableValue()
			: NumberFormatConfig.Currency.format(Math.round(cents) / NumberFormatConfig.CentsPerDollar);
	}
}
