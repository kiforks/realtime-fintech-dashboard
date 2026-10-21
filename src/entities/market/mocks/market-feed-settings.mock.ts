import { MarketFeedSettings } from '../models';

export abstract class MarketFeedSettingsMock {
	public static create(data?: Partial<MarketFeedSettings>): MarketFeedSettings {
		return {
			batchIntervalMs: 500,
			instrumentCount: 2,
			updatesPerBatch: 100,
			...data,
		};
	}
}
