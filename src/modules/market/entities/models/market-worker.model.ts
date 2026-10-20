import { ProducerCommand, ProducerEvent } from './producer-message.model';

export interface MarketWorker {
	onerror: ((event: ErrorEvent) => void) | null;
	onmessage: ((event: MessageEvent<ProducerEvent>) => void) | null;
	postMessage(command: ProducerCommand): void;
	terminate(): void;
}
