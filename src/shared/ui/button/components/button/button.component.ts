import { Component, input } from '@angular/core';

import { ButtonAppearance } from '../../models';

@Component({
	selector: 'button[appButton]',
	templateUrl: './button.component.html',
	styleUrl: './button.component.scss',
	host: { '[class.app-button-primary]': "appearance() === 'primary'" },
})
export class ButtonComponent {
	public readonly appearance = input<ButtonAppearance, ButtonAppearance | ''>('secondary', {
		alias: 'appButton',
		transform: appearance => (appearance === '' ? 'secondary' : appearance),
	});
}
