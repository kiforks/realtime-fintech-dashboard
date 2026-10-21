import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

import { FormLabelComponent } from './form-label.component';

import { FormInputComponent } from '../form-input';

@Component({
	selector: 'app-form-label-host-spec',
	imports: [FormField, FormInputComponent, FormLabelComponent],
	templateUrl: './form-label-host.spec.component.html',
})
export class FormLabelHostSpecComponent {
	protected readonly ageForm = form(signal({ age: 30 }));
}
