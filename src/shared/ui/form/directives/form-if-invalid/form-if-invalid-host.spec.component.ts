import { Component, signal } from '@angular/core';
import { form, FormField, max, min } from '@angular/forms/signals';

import { FormIfInvalidDirective } from './form-if-invalid.directive';

@Component({
	selector: 'app-form-if-invalid-host-spec',
	imports: [FormField, FormIfInvalidDirective],
	templateUrl: './form-if-invalid-host.spec.component.html',
})
export class FormIfInvalidHostSpecComponent {
	protected readonly ageForm = form(signal({ age: 30 }), ({ age }) => {
		min(age, 18);
		max(age, 99);
	});
}
