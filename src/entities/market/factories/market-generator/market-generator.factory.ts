import { MarketBatchGenerator } from '../../models';

import { initSync, MarketGenerator } from '~wasm/market_generator';
import marketGeneratorBytes from '~wasm/market_generator_bg.wasm';

export abstract class MarketGeneratorFactory {
	public static create(instrumentCount: number, seed: number): MarketBatchGenerator {
		initSync({ module: marketGeneratorBytes });

		return new MarketGenerator(instrumentCount, seed);
	}
}
