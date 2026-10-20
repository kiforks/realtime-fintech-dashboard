import { ProducerCommand } from '../../models';

import { MarketProducer } from './market-producer';

import { initSync, MarketGenerator } from '~wasm/market_generator';
import marketGeneratorBytes from '~wasm/market_generator_bg.wasm';

const createGenerator = (instrumentCount: number): MarketGenerator => {
	const [seed] = crypto.getRandomValues(new Uint32Array(1));

	initSync({ module: marketGeneratorBytes });

	return new MarketGenerator(instrumentCount, seed);
};

const producer = new MarketProducer(createGenerator, event => {
	postMessage(event);
});

addEventListener('message', ({ data }: MessageEvent<ProducerCommand>) => {
	producer.handle(data);
});
