import { Component, computed, input } from '@angular/core';
import { ReadonlyFieldState } from '@angular/forms/signals';

import { FormFieldHelper } from '../../helpers';

@Component({
	selector: 'p[appFormError]',
	template: '<ng-content />',
	styleUrl: './form-error.component.scss',
	host: {
		role: 'alert',
		'[id]': 'id()',
	},
})
export class FormErrorComponent {
	public readonly field = input.required<ReadonlyFieldState<unknown>>({ alias: 'appFormError' });
	protected readonly id = computed(() => FormFieldHelper.errorId(this.field()));
}
