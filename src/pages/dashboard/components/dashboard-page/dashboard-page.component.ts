import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { DashboardRatePipe } from '../../pipes';
import { CentsPipe, SignedRatioPipe } from '~/shared/pipes';

import { MarketFeedDirective, MarketFeedErrorDirective } from '~/entities/market';
import { AlertComponent } from '~/shared/ui/alert';
import { BadgeComponent } from '~/shared/ui/badge';
import { ButtonComponent } from '~/shared/ui/button';
import { NoteComponent } from '~/shared/ui/note';
import { PageHeaderComponent, PageTitleComponent } from '~/shared/ui/page';
import {
	TableCaptionComponent,
	TableCellComponent,
	TableComponent,
	TableRowComponent,
	TableScrollComponent,
} from '~/shared/ui/table';

@Component({
	selector: 'app-dashboard-page',
	imports: [
		AlertComponent,
		BadgeComponent,
		ButtonComponent,
		CentsPipe,
		DashboardRatePipe,
		DecimalPipe,
		MarketFeedDirective,
		MarketFeedErrorDirective,
		NoteComponent,
		PageHeaderComponent,
		PageTitleComponent,
		SignedRatioPipe,
		TableCaptionComponent,
		TableCellComponent,
		TableComponent,
		TableRowComponent,
		TableScrollComponent,
	],
	templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {}
