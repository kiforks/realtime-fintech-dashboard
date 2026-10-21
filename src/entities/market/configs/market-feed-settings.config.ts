import { MarketFeedSettings } from '../models';
import { IntegerRange } from '~/shared/models';

export abstract class MarketFeedSettingsConfig {
	public static readonly Defaults: MarketFeedSettings = {
		batchIntervalMs: 500,
		instrumentCount: 5,
		updatesPerBatch: 100,
	};
	public static readonly Ranges: Readonly<Record<keyof MarketFeedSettings, IntegerRange>> = {
		batchIntervalMs: { max: 2000, min: 50 },
		instrumentCount: { max: 50, min: 1 },
		updatesPerBatch: { max: 1000, min: 1 },
	};
}
