import { Component, signal } from '@angular/core';
import { form, FormField, max, min } from '@angular/forms/signals';

import { FormComponent, FormErrorComponent, FormInputComponent, FormLabelComponent } from '../../components';
import { FormIfInvalidDirective } from '../../directives';

@Component({
	selector: 'app-form-host-spec',
	imports: [
		FormComponent,
		FormErrorComponent,
		FormField,
		FormIfInvalidDirective,
		FormInputComponent,
		FormLabelComponent,
	],
	templateUrl: './form-host.spec.component.html',
})
export class FormHostSpecComponent {
	protected readonly ageForm = form(signal({ age: 30 }), ({ age }) => {
		min(age, 18);
		max(age, 99);
	});
}
