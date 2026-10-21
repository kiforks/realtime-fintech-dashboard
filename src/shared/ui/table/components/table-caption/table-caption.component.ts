import { Component, inject } from '@angular/core';

import { UniqueIdService } from '../../../../services';

@Component({
	selector: '[appTableCaption]',
	templateUrl: './table-caption.component.html',
	styleUrl: './table-caption.component.scss',
	host: { '[id]': 'id' },
})
export class TableCaptionComponent {
	public readonly id = inject(UniqueIdService).next('app-table-caption');
}
