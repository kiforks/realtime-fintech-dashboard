import { InstrumentStats } from './instrument-stats.model';
import { ProducerSettings } from './producer-settings.model';

export type ProducerCommand =
	{ runId: number; settings: ProducerSettings; type: 'start' } | { type: 'pause' } | { type: 'resume' };

export type ProducerEvent =
	| { message: string; runId: number; type: 'error' }
	| { runId: number; stats: readonly InstrumentStats[]; type: 'snapshot' };
