import { MarketBatchGenerator, MarketFeedSettings, MarketInstrumentStats, MarketProducerEvent } from '../../models';

import { MarketBatchGeneratorMock, MarketFeedSettingsMock, MarketInstrumentStatsMock } from '../../mocks';
import { MarketProducer } from './market.producer';

import type { Mock } from 'vitest';

const tradedAlfaStats = (batches: number): MarketInstrumentStats =>
	MarketInstrumentStatsMock.create({ notionalCents: 306000 * batches, volume: 30 * batches });

describe(MarketProducer, () => {
	let settings: MarketFeedSettings;
	let generator: MarketBatchGeneratorMock;
	let createGenerator: Mock<(instrumentCount: number) => MarketBatchGenerator>;
	let post: Mock<(event: MarketProducerEvent) => void>;
	let producer: MarketProducer;

	beforeEach(() => {
		vi.useFakeTimers();
		settings = MarketFeedSettingsMock.create();
		generator = new MarketBatchGeneratorMock();
		createGenerator = vi.fn<(instrumentCount: number) => MarketBatchGenerator>(() => generator);
		post = vi.fn<(event: MarketProducerEvent) => void>();
		producer = new MarketProducer(createGenerator, post);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should generate one batch of the requested size per interval and post cumulative stats', () => {
		const { batchIntervalMs, instrumentCount, updatesPerBatch } = settings;

		producer.handle({ runId: 1, settings, type: 'start' });
		vi.advanceTimersByTime(batchIntervalMs * 3);

		expect(createGenerator).toHaveBeenCalledWith(instrumentCount);
		expect(generator.nextBatch).toHaveBeenCalledTimes(3);
		expect(generator.nextBatch).toHaveBeenCalledWith(updatesPerBatch);
		expect(post).toHaveBeenLastCalledWith({
			runId: 1,
			stats: [tradedAlfaStats(3), MarketInstrumentStatsMock.empty('BETA')],
			type: 'snapshot',
		});
	});

	it('should stop generating while paused and resume without catching up on the paused time', () => {
		const { batchIntervalMs } = settings;

		producer.handle({ runId: 1, settings, type: 'start' });
		vi.advanceTimersByTime(batchIntervalMs);
		producer.handle({ type: 'pause' });
		vi.advanceTimersByTime(batchIntervalMs * 10);

		expect(generator.nextBatch).toHaveBeenCalledTimes(1);

		producer.handle({ type: 'resume' });
		vi.advanceTimersByTime(batchIntervalMs);

		expect(generator.nextBatch).toHaveBeenCalledTimes(2);
		expect(post).toHaveBeenLastCalledWith({
			runId: 1,
			stats: [tradedAlfaStats(2), MarketInstrumentStatsMock.empty('BETA')],
			type: 'snapshot',
		});
	});

	it('should keep a single timer when resumed while already running', () => {
		producer.handle({ runId: 1, settings, type: 'start' });
		producer.handle({ type: 'resume' });
		vi.advanceTimersByTime(settings.batchIntervalMs);

		expect(generator.nextBatch).toHaveBeenCalledTimes(1);
	});

	it('should free the previous generator and start from empty totals on a new run', () => {
		const { batchIntervalMs } = settings;
		const nextGenerator = new MarketBatchGeneratorMock();
		const twoRunProducer = new MarketProducer(
			vi
				.fn<(instrumentCount: number) => MarketBatchGenerator>()
				.mockReturnValueOnce(generator)
				.mockReturnValueOnce(nextGenerator),
			post
		);

		twoRunProducer.handle({ runId: 1, settings, type: 'start' });
		vi.advanceTimersByTime(batchIntervalMs * 2);
		twoRunProducer.handle({ runId: 2, settings, type: 'start' });
		vi.advanceTimersByTime(batchIntervalMs);

		expect(generator.free).toHaveBeenCalledTimes(1);
		expect(generator.nextBatch).toHaveBeenCalledTimes(2);
		expect(post).toHaveBeenLastCalledWith({
			runId: 2,
			stats: [tradedAlfaStats(1), MarketInstrumentStatsMock.empty('BETA')],
			type: 'snapshot',
		});
	});

	it('should start generating for a new run even when the previous run was paused', () => {
		producer.handle({ runId: 1, settings, type: 'start' });
		producer.handle({ type: 'pause' });
		producer.handle({ runId: 2, settings, type: 'start' });
		vi.advanceTimersByTime(settings.batchIntervalMs);

		expect(post).toHaveBeenLastCalledWith({
			runId: 2,
			stats: [tradedAlfaStats(1), MarketInstrumentStatsMock.empty('BETA')],
			type: 'snapshot',
		});
	});

	it('should report an error and generate nothing when the generator cannot be created', () => {
		const failingProducer = new MarketProducer(() => {
			throw new Error('instrument count must be between 1 and 50, got 0');
		}, post);

		failingProducer.handle({ runId: 1, settings, type: 'start' });
		failingProducer.handle({ type: 'resume' });
		vi.advanceTimersByTime(settings.batchIntervalMs * 2);

		expect(post).toHaveBeenCalledTimes(1);
		expect(post).toHaveBeenCalledWith({
			message: 'instrument count must be between 1 and 50, got 0',
			runId: 1,
			type: 'error',
		});
	});

	it('should stop and report an error when generating a batch fails', () => {
		const failingGenerator = new MarketBatchGeneratorMock(() => {
			throw new Error('memory access out of bounds');
		});
		const failingProducer = new MarketProducer(() => failingGenerator, post);

		failingProducer.handle({ runId: 1, settings, type: 'start' });
		vi.advanceTimersByTime(settings.batchIntervalMs * 3);

		expect(failingGenerator.nextBatch).toHaveBeenCalledTimes(1);
		expect(post).toHaveBeenCalledWith({ message: 'memory access out of bounds', runId: 1, type: 'error' });
	});

	it('should still explain a failure that comes without a message', () => {
		const failingProducer = new MarketProducer(() => {
			throw new Error();
		}, post);

		failingProducer.handle({ runId: 1, settings, type: 'start' });

		expect(post).toHaveBeenCalledWith({ message: 'Error', runId: 1, type: 'error' });
	});
});
