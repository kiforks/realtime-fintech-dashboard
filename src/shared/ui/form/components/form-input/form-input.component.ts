import { Component, computed, inject } from '@angular/core';
import { FORM_FIELD } from '@angular/forms/signals';

import { FormFieldHelper } from '../../helpers';

@Component({
	selector: '[appFormInput]',
	templateUrl: './form-input.component.html',
	styleUrl: './form-input.component.scss',
	host: {
		'[attr.aria-describedby]': 'errorId()',
		'[attr.aria-invalid]': 'showsError()',
		'[id]': 'id()',
	},
})
export class FormInputComponent {
	protected readonly id = computed(() => this._formField.state().name());
	protected readonly showsError = computed(() => FormFieldHelper.showsError(this._formField.state()));
	protected readonly errorId = computed(() =>
		this.showsError() ? FormFieldHelper.errorId(this._formField.state()) : null
	);

	private readonly _formField = inject(FORM_FIELD, { self: true });
}
