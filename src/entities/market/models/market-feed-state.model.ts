import { MarketFeedStatus } from '../enums';

export type MarketFeedState =
	| { readonly errorMessage: string; readonly status: MarketFeedStatus.Failed }
	| { readonly status: MarketFeedStatus.Paused | MarketFeedStatus.Running };
