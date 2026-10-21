import { MarketGeneratorFactory } from '../../factories';
import { MarketProducerCommand } from '../../models';

import { MarketProducer } from '../../producers';

const producer = new MarketProducer(
	instrumentCount => {
		const [seed] = crypto.getRandomValues(new Uint32Array(1));

		return MarketGeneratorFactory.create(instrumentCount, seed);
	},
	event => {
		postMessage(event);
	}
);

addEventListener('message', ({ data }: MessageEvent<MarketProducerCommand>) => {
	producer.handle(data);
});
