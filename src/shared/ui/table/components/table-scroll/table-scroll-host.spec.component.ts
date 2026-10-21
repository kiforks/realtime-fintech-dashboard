import { Component } from '@angular/core';

import { TableScrollComponent } from './table-scroll.component';

import { TableCaptionComponent } from '../table-caption';

@Component({
	selector: 'app-table-scroll-host-spec',
	imports: [TableCaptionComponent, TableScrollComponent],
	templateUrl: './table-scroll-host.spec.component.html',
})
export class TableScrollHostSpecComponent {}
