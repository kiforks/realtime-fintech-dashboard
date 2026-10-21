import { Component } from '@angular/core';

@Component({
	selector: 'form[appForm]',
	template: '<ng-content />',
	styleUrl: './form.component.scss',
})
export class FormComponent {}
