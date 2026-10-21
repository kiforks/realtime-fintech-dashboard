import { SettingsDraft } from '../../models';

import { MarketFeedSettings } from '~/entities/market';

export abstract class SettingsDraftHelper {
	public static toFeedSettings({
		batchIntervalMs,
		instrumentCount,
		updatesPerBatch,
	}: SettingsDraft): MarketFeedSettings | null {
		const isComplete = batchIntervalMs !== null && instrumentCount !== null && updatesPerBatch !== null;

		return isComplete ? { batchIntervalMs, instrumentCount, updatesPerBatch } : null;
	}
}
