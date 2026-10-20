import { ProducerSettingsDraft } from '../../models';

import { ProducerSettings } from '~/entities/market';

export abstract class ProducerSettingsHelper {
	public static fromDraft({
		batchIntervalMs,
		instrumentCount,
		updatesPerBatch,
	}: ProducerSettingsDraft): ProducerSettings | null {
		const isComplete = batchIntervalMs !== null && instrumentCount !== null && updatesPerBatch !== null;

		return isComplete ? { batchIntervalMs, instrumentCount, updatesPerBatch } : null;
	}
}
