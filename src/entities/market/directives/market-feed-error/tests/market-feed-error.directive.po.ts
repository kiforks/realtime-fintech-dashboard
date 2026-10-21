import { Locator, page } from 'vitest/browser';

export class MarketFeedErrorDirectivePO {
	public get error(): Locator {
		return page.getByTestId('market-feed-error');
	}
}
