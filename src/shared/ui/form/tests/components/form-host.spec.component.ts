import { Component, signal } from '@angular/core';
import { form, FormField, max, min } from '@angular/forms/signals';

import { FormComponent, FormErrorComponent, FormInputComponent, FormLabelComponent } from '../../components';
import { FormIfInvalidDirective } from '../../directives';

const MIN_AGE = 18;
const MAX_AGE = 99;

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
	template: `
		<form appForm>
			<label [appFormLabel]="ageForm.age">Age</label>

			<input appFormInput type="number" [formField]="ageForm.age" data-po="form-age" />

			<p *appFormIfInvalid="ageForm.age; let field" [appFormError]="field" data-po="form-age-error">
				Enter an age from {{ field.min?.() }} to {{ field.max?.() }}.
			</p>
		</form>
	`,
})
export class FormHostSpecComponent {
	protected readonly ageForm = form(signal({ age: 30 }), ({ age }) => {
		min(age, MIN_AGE);
		max(age, MAX_AGE);
	});
}
