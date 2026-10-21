import { Component, contentChild } from '@angular/core';

import { TableCaptionComponent } from '../table-caption';

@Component({
	selector: '[appTableScroll]',
	templateUrl: './table-scroll.component.html',
	styleUrl: './table-scroll.component.scss',
	host: {
		tabindex: '0',
		'[attr.aria-labelledby]': 'caption()?.id',
	},
})
export class TableScrollComponent {
	protected readonly caption = contentChild(TableCaptionComponent);
}
