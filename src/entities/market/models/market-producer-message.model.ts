import { MarketFeedSettings } from './market-feed-settings.model';
import { MarketInstrumentStats } from './market-instrument-stats.model';

export interface MarketProducerStartCommand {
	readonly runId: number;
	readonly settings: MarketFeedSettings;
	readonly type: 'start';
}

export type MarketProducerCommand =
	MarketProducerStartCommand | { readonly type: 'pause' } | { readonly type: 'resume' };

export type MarketProducerEvent =
	| { readonly message: string; readonly runId: number; readonly type: 'error' }
	| { readonly runId: number; readonly stats: readonly MarketInstrumentStats[]; readonly type: 'snapshot' };
