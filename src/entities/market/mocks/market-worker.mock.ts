import { MarketProducerCommand, MarketProducerEvent, MarketWorker } from '../models';

export class MarketWorkerMock implements MarketWorker {
	public onerror: ((event: ErrorEvent) => void) | null = null;
	public onmessage: ((event: MessageEvent<MarketProducerEvent>) => void) | null = null;
	public readonly postMessage = vi.fn<(command: MarketProducerCommand) => void>();
	public readonly terminate = vi.fn<() => void>();

	public emit(event: MarketProducerEvent): void {
		this.onmessage?.(new MessageEvent('message', { data: event }));
	}

	public crash(message: string): void {
		this.onerror?.(new ErrorEvent('error', { cancelable: true, message }));
	}
}
