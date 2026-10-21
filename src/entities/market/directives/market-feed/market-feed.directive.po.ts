import { Locator, page } from 'vitest/browser';

export class MarketFeedDirectivePO {
	public get status(): Locator {
		return page.getByTestId('market-feed-status');
	}

	public get toggle(): Locator {
		return page.getByTestId('market-feed-toggle');
	}
}
