import { Component } from '@angular/core';

import { ButtonComponent } from '../../components';

@Component({
	selector: 'app-button-host-spec',
	imports: [ButtonComponent],
	template: `
		<button appButton type="button" data-po="button-secondary">Pause</button>

		<button appButton="primary" type="submit" data-po="button-primary">Apply</button>
	`,
})
export class ButtonHostSpecComponent {}
