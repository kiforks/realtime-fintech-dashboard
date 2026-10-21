import { MarketFeedSettings } from '~/entities/market';

export type SettingsDraft = { -readonly [Key in keyof MarketFeedSettings]: MarketFeedSettings[Key] | null };
