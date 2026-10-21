import { Pipe, PipeTransform } from '@angular/core';

import { MarketFeedSettings } from '~/entities/market';

const MS_PER_SECOND = 1000;

@Pipe({ name: 'dashboardRate' })
export class DashboardRatePipe implements PipeTransform {
	public transform(settings: MarketFeedSettings): number {
		return DashboardRatePipe.transform(settings);
	}

	public static transform({ batchIntervalMs, updatesPerBatch }: MarketFeedSettings): number {
		return (updatesPerBatch * MS_PER_SECOND) / batchIntervalMs;
	}
}
