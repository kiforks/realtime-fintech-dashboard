import { Component, computed, input } from '@angular/core';
import { Field } from '@angular/forms/signals';

@Component({
	selector: 'label[appFormLabel]',
	templateUrl: './form-label.component.html',
	styleUrl: './form-label.component.scss',
	host: { '[attr.for]': 'controlId()' },
})
export class FormLabelComponent {
	public readonly field = input.required<Field<unknown>>({ alias: 'appFormLabel' });
	protected readonly controlId = computed(() => this.field()().name());
}
