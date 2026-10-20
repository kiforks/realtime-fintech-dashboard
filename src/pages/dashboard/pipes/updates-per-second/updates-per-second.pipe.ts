import { Pipe, PipeTransform } from '@angular/core';

import { ProducerSettings } from '~/entities/market';

const MS_PER_SECOND = 1000;

@Pipe({ name: 'updatesPerSecond' })
export class UpdatesPerSecondPipe implements PipeTransform {
	public transform(settings: ProducerSettings): number {
		return UpdatesPerSecondPipe.transform(settings);
	}

	public static transform({ batchIntervalMs, updatesPerBatch }: ProducerSettings): number {
		return (updatesPerBatch * MS_PER_SECOND) / batchIntervalMs;
	}
}
