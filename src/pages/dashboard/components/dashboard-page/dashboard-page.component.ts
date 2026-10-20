import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { CentsPipe, SignedRatioPipe } from '~shared/pipes';

import {
	InstrumentMetrics,
	MarketFeedService,
	ProducerSettings,
	ProducerStatus,
	UpdatesPerSecondPipe,
} from '~/entities/market';

@Component({
	selector: 'app-dashboard-page',
	imports: [CentsPipe, DecimalPipe, SignedRatioPipe, UpdatesPerSecondPipe],
	templateUrl: './dashboard-page.component.html',
	styleUrl: './dashboard-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
	protected readonly isFailed = computed(() => this._marketFeedService.status() === ProducerStatus.Failed);
	protected readonly isPaused = computed(() => this._marketFeedService.status() === ProducerStatus.Paused);
	private readonly _marketFeedService = inject(MarketFeedService);

	protected get errorMessage(): Signal<string | null> {
		return this._marketFeedService.errorMessage;
	}

	protected get rows(): Signal<InstrumentMetrics[]> {
		return this._marketFeedService.rows;
	}

	protected get settings(): Signal<ProducerSettings> {
		return this._marketFeedService.settings;
	}

	protected get status(): Signal<ProducerStatus> {
		return this._marketFeedService.status;
	}

	protected togglePause(): void {
		this._marketFeedService.togglePause();
	}
}
