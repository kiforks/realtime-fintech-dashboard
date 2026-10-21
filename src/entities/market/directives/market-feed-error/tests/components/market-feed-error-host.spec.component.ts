import { Component } from '@angular/core';

import { MarketFeedErrorDirective } from '../../market-feed-error.directive';

@Component({
	selector: 'app-market-feed-error-host-spec',
	imports: [MarketFeedErrorDirective],
	template: '<p *appMarketFeedError="let message" data-po="market-feed-error">Stopped: {{ message }}</p>',
})
export class MarketFeedErrorHostSpecComponent {}
