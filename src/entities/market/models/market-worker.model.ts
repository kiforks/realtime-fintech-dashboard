import { MarketProducerCommand, MarketProducerEvent } from './market-producer-message.model';

export interface MarketWorker {
	onerror: ((event: ErrorEvent) => void) | null;
	onmessage: ((event: MessageEvent<MarketProducerEvent>) => void) | null;
	postMessage(command: MarketProducerCommand): void;
	terminate(): void;
}
