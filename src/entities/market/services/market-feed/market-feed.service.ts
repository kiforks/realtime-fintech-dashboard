import { computed, DestroyRef, inject, Service, Signal, signal } from '@angular/core';

import { MarketMetricsHelper } from '../../helpers';
import { ProducerStatus } from '../../enums';
import { InstrumentStats, MarketWorker, ProducerEvent, ProducerSettings } from '../../models';

import { ProducerSettingsConfig } from '../../configs';
import { MARKET_WORKER_FACTORY } from '../../tokens';

@Service()
export class MarketFeedService {
	public readonly rows = computed(() => this._stats().map(stats => MarketMetricsHelper.toMetrics(stats)));
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _marketWorkerFactory = inject(MARKET_WORKER_FACTORY);
	private readonly _errorMessage = signal<string | null>(null);
	private readonly _settings = signal<ProducerSettings>(ProducerSettingsConfig.Defaults);
	private readonly _stats = signal<readonly InstrumentStats[]>([]);
	private readonly _status = signal(ProducerStatus.Running);
	private _runId = 0;
	private _worker: MarketWorker | null = null;

	constructor() {
		this._setup();
	}

	public get errorMessage(): Signal<string | null> {
		return this._errorMessage.asReadonly();
	}

	public get settings(): Signal<ProducerSettings> {
		return this._settings.asReadonly();
	}

	public get status(): Signal<ProducerStatus> {
		return this._status.asReadonly();
	}

	public apply(settings: ProducerSettings): void {
		this._runId += 1;
		this._settings.set(settings);
		this._stats.set(MarketMetricsHelper.empty(settings.instrumentCount));
		this._errorMessage.set(null);
		this._status.set(ProducerStatus.Running);
		this._connect().postMessage({ runId: this._runId, settings, type: 'start' });
	}

	public togglePause(): void {
		const status = this._status();

		if (status === ProducerStatus.Failed) {
			return;
		}

		const isRunning = status === ProducerStatus.Running;

		this._connect().postMessage({ type: isRunning ? 'pause' : 'resume' });
		this._status.set(isRunning ? ProducerStatus.Paused : ProducerStatus.Running);
	}

	private _setup(): void {
		this._destroyRef.onDestroy(() => {
			this._worker?.terminate();
		});
		this.apply(ProducerSettingsConfig.Defaults);
	}

	private _connect(): MarketWorker {
		this._worker ??= this._createWorker();

		return this._worker;
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

	private _receive(event: ProducerEvent): void {
		if (event.runId !== this._runId) {
			return;
		}

		if (event.type === 'error') {
			this._fail(event.message);

			return;
		}

		this._stats.set(event.stats);
	}

	private _crash(event: ErrorEvent): void {
		event.preventDefault();
		this._fail($localize`The market data worker stopped unexpectedly`);
	}

	private _fail(message: string): void {
		this._worker?.terminate();
		this._worker = null;
		this._errorMessage.set(message);
		this._status.set(ProducerStatus.Failed);
	}
}
