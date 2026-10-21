import { schema } from '@angular/forms/signals';

import { IntegerRangeValidator } from '~/shared/validators';
import { SettingsDraft } from '../../models';

import { MarketFeedSettingsConfig } from '~/entities/market';

export const SETTINGS_FORM_SCHEMA = schema<SettingsDraft>(({ batchIntervalMs, instrumentCount, updatesPerBatch }) => {
	const { Ranges } = MarketFeedSettingsConfig;

	IntegerRangeValidator.apply(instrumentCount, Ranges.instrumentCount);
	IntegerRangeValidator.apply(updatesPerBatch, Ranges.updatesPerBatch);
	IntegerRangeValidator.apply(batchIntervalMs, Ranges.batchIntervalMs);
});
