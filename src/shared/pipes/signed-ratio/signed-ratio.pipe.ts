import { Pipe, PipeTransform } from '@angular/core';

import { NumberFormatConfig } from '../../configs';

@Pipe({ name: 'signedRatio' })
export class SignedRatioPipe implements PipeTransform {
	public transform(ratio: number | null): string {
		return SignedRatioPipe.transform(ratio);
	}

	public static transform(ratio: number | null): string {
		return ratio === null ? NumberFormatConfig.unavailableValue() : NumberFormatConfig.SignedRatio.format(ratio);
	}
}
