import { Component } from '@angular/core';

import { MarketFeedDirective } from '../../market-feed.directive';

@Component({
	selector: 'app-market-feed-host-spec',
	imports: [MarketFeedDirective],
	templateUrl: './market-feed-host.spec.component.html',
})
export class MarketFeedHostSpecComponent {}
