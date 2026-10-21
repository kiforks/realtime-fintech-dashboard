import { computed, DestroyRef, inject, Service, Signal, signal } from '@angular/core';

import { MarketMetricsHelper } from '../../helpers';
import { MarketFeedStatus } from '../../enums';
import {
	MarketFeedSettings,
	MarketFeedState,
	MarketInstrumentStats,
	MarketProducerCommand,
	MarketProducerEvent,
	MarketWorker,
} from '../../models';

import { MarketFeedSettingsConfig } from '../../configs';
import { MARKET_WORKER_FACTORY } from '../../tokens';

@Service()
export class MarketFeedService {
	public readonly rows = computed(() => this._stats().map(stats => MarketMetricsHelper.toMetrics(stats)));
	public readonly status = computed(() => this._state().status);
	public readonly errorMessage = computed(() => {
		const state = this._state();

		return state.status === MarketFeedStatus.Failed ? state.errorMessage : null;
	});

	public readonly isPaused = computed(() => this.status() === MarketFeedStatus.Paused);
	public readonly canTogglePause = computed(() => this.status() !== MarketFeedStatus.Failed);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _marketWorkerFactory = inject(MARKET_WORKER_FACTORY);
	private readonly _settings = signal<MarketFeedSettings>(MarketFeedSettingsConfig.Defaults);
	private readonly _state = signal<MarketFeedState>({ status: MarketFeedStatus.Running });
	private readonly _stats = signal<readonly MarketInstrumentStats[]>([]);
	private _runId = 0;
	private _worker: MarketWorker | null = null;

	constructor() {
		this._setup();
	}

	public get settings(): Signal<MarketFeedSettings> {
		return this._settings.asReadonly();
	}

	public start(): void {
		this.apply(MarketFeedSettingsConfig.Defaults);
	}

	public apply(settings: MarketFeedSettings): void {
		this._runId += 1;
		this._settings.set(settings);
		this._stats.set(MarketMetricsHelper.empty(settings.instrumentCount));
		this._state.set({ status: MarketFeedStatus.Running });
		this._post({ runId: this._runId, settings, type: 'start' });
	}

	public togglePause(): void {
		const { status } = this._state();

		switch (status) {
			case MarketFeedStatus.Running:
				this._post({ type: 'pause' });
				this._state.set({ status: MarketFeedStatus.Paused });
				break;
			case MarketFeedStatus.Paused:
				this._post({ type: 'resume' });
				this._state.set({ status: MarketFeedStatus.Running });
				break;
			default:
				break;
		}
	}

	private _setup(): void {
		this._destroyRef.onDestroy(() => {
			this._worker?.terminate();
		});
	}

	private _post(command: MarketProducerCommand): void {
		this._worker ??= this._createWorker();
		this._worker.postMessage(command);
	}

	private _createWorker(): MarketWorker {
		const worker = this._marketWorkerFactory();

		worker.onmessage = ({ data }) => {
			this._receive(data);
		};

		worker.onerror = event => {
			this._crash(event);
		};

		return worker;
	}

	private _receive(event: MarketProducerEvent): void {
		if (event.runId !== this._runId) {
			return;
		}

		switch (event.type) {
			case 'error':
				this._fail(event.message);
				break;
			case 'snapshot':
				this._update(event.stats);
				break;
			default:
				break;
		}
	}

	private _update(stats: readonly MarketInstrumentStats[]): void {
		if (this.isPaused()) {
			return;
		}

		this._stats.set(stats);
	}

	private _crash(event: ErrorEvent): void {
		event.preventDefault();
		this._fail($localize`The market data worker stopped unexpectedly`);
	}

	private _fail(errorMessage: string): void {
		this._worker?.terminate();
		this._worker = null;
		this._state.set({ errorMessage, status: MarketFeedStatus.Failed });
	}
}
