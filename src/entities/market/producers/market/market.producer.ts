import { MarketMetricsHelper } from '../../helpers';
import {
	MarketBatchGenerator,
	MarketFeedSettings,
	MarketInstrumentStats,
	MarketProducerCommand,
	MarketProducerEvent,
	MarketProducerStartCommand,
} from '../../models';

import { MarketFeedSettingsConfig } from '../../configs';

export class MarketProducer {
	private _generator: MarketBatchGenerator | null = null;
	private _runId = 0;
	private _settings: MarketFeedSettings = MarketFeedSettingsConfig.Defaults;
	private _stats: MarketInstrumentStats[] = [];
	private _timer: ReturnType<typeof setInterval> | null = null;

	constructor(
		private readonly _createGenerator: (instrumentCount: number) => MarketBatchGenerator,
		private readonly _post: (event: MarketProducerEvent) => void
	) {}

	public handle(command: MarketProducerCommand): void {
		switch (command.type) {
			case 'start':
				this._start(command);
				break;
			case 'pause':
				this._stop();
				break;
			case 'resume':
				this._schedule();
				break;
			default:
				break;
		}
	}

	private _start({ runId, settings }: MarketProducerStartCommand): void {
		const { instrumentCount } = settings;

		this._stop();
		this._generator?.free();
		this._generator = null;
		this._runId = runId;
		this._settings = settings;
		this._stats = MarketMetricsHelper.empty(instrumentCount);

		try {
			this._generator = this._createGenerator(instrumentCount);
		} catch (error) {
			this._fail(error);

			return;
		}

		this._schedule();
	}

	private _schedule(): void {
		const generator = this._generator;
		const isScheduled = this._timer !== null;

		if (generator === null || isScheduled) {
			return;
		}

		this._timer = setInterval(() => {
			this._tick(generator);
		}, this._settings.batchIntervalMs);
	}

	private _tick(generator: MarketBatchGenerator): void {
		try {
			this._stats = MarketMetricsHelper.accumulate(this._stats, generator.nextBatch(this._settings.updatesPerBatch));
			this._post({ runId: this._runId, stats: this._stats, type: 'snapshot' });
		} catch (error) {
			this._stop();
			this._fail(error);
		}
	}

	private _stop(): void {
		if (this._timer === null) {
			return;
		}

		clearInterval(this._timer);
		this._timer = null;
	}

	private _fail(error: unknown): void {
		const isDescribed = error instanceof Error && error.message !== '';
		const message = isDescribed ? error.message : String(error);

		this._post({ message, runId: this._runId, type: 'error' });
	}
}
