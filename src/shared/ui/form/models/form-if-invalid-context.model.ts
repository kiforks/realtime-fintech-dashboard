import { ReadonlyFieldState } from '@angular/forms/signals';

export interface FormIfInvalidContext {
	readonly $implicit: ReadonlyFieldState<unknown>;
}
