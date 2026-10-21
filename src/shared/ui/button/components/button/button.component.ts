import { Component, input } from '@angular/core';

import { ButtonAppearance } from '../../models';

@Component({
	selector: '[appButton]',
	templateUrl: './button.component.html',
	styleUrl: './button.component.scss',
	host: { '[class]': 'appearance()' },
})
export class ButtonComponent {
	public readonly appearance = input.required<ButtonAppearance, ButtonAppearance | ''>({
		alias: 'appButton',
		transform: appearance => (appearance === '' ? 'secondary' : appearance),
	});
}
