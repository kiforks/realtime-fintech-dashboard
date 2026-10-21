import type { MarketFeedService } from '../services';

export interface MarketFeedContext {
	readonly $implicit: MarketFeedService;
}
