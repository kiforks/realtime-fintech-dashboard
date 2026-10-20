import { IntegerRange, ProducerSettings } from '../models';

export abstract class ProducerSettingsConfig {
	public static readonly Defaults: ProducerSettings = {
		batchIntervalMs: 500,
		instrumentCount: 5,
		updatesPerBatch: 100,
	};
	public static readonly InstrumentCount: IntegerRange = { max: 50, min: 1 };
	public static readonly UpdatesPerBatch: IntegerRange = { max: 1000, min: 1 };
	public static readonly BatchIntervalMs: IntegerRange = { max: 2000, min: 50 };
}
