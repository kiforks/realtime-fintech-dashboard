import { ReadonlyFieldState } from '@angular/forms/signals';

export abstract class FormFieldHelper {
	public static showsError({ invalid, touched }: ReadonlyFieldState<unknown>): boolean {
		return touched() && invalid();
	}

	public static errorId({ name }: ReadonlyFieldState<unknown>): string {
		return `${name()}.error`;
	}
}
