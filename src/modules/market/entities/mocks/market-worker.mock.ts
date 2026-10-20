import { MarketWorker, ProducerCommand, ProducerEvent } from '../models';

export class MarketWorkerMock implements MarketWorker {
	public onerror: ((event: ErrorEvent) => void) | null = null;
	public onmessage: ((event: MessageEvent<ProducerEvent>) => void) | null = null;
	public readonly postMessage = vi.fn<(command: ProducerCommand) => void>();
	public readonly terminate = vi.fn<() => void>();

	public emit(event: ProducerEvent): void {
		this.onmessage?.(new MessageEvent('message', { data: event }));
	}

	public crash(message: string): void {
		this.onerror?.(new ErrorEvent('error', { cancelable: true, message }));
	}
}
