import { Component, signal } from '@angular/core';
import { form } from '@angular/forms/signals';

import { FormErrorComponent } from './form-error.component';

@Component({
	selector: 'app-form-error-host-spec',
	imports: [FormErrorComponent],
	templateUrl: './form-error-host.spec.component.html',
})
export class FormErrorHostSpecComponent {
	protected readonly ageForm = form(signal({ age: 30 }));
}
