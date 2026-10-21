import { Component } from '@angular/core';

import { MarketFeedDirective } from '../../market-feed.directive';

@Component({
	selector: 'app-market-feed-host-spec',
	imports: [MarketFeedDirective],
	template: `
		<p *appMarketFeed="let feed" data-po="market-feed-status">{{ feed.status() }}</p>

		<button *appMarketFeed="let feed" type="button" (click)="feed.togglePause()" data-po="market-feed-toggle">
			Toggle
		</button>
	`,
})
export class MarketFeedHostSpecComponent {}
