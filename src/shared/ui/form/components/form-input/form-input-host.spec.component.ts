import { Component, signal } from '@angular/core';
import { form, FormField, max, min } from '@angular/forms/signals';

import { FormIfInvalidDirective } from '../../directives';
import { FormInputComponent } from './form-input.component';

import { FormErrorComponent } from '../form-error';

@Component({
	selector: 'app-form-input-host-spec',
	imports: [FormErrorComponent, FormField, FormIfInvalidDirective, FormInputComponent],
	templateUrl: './form-input-host.spec.component.html',
})
export class FormInputHostSpecComponent {
	protected readonly ageForm = form(signal({ age: 30 }), ({ age }) => {
		min(age, 18);
		max(age, 99);
	});
}
