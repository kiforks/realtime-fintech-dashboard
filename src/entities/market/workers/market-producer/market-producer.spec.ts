import { MarketBatchGenerator, ProducerEvent, ProducerSettings } from '../../models';

import { MarketBatchGeneratorMock } from '../../mocks';
import { MarketProducer } from './market-producer';

import type { Mock } from 'vitest';

const BATCH_INTERVAL_MS = 500;
const UPDATES_PER_BATCH = 100;

const settings: ProducerSettings = {
	batchIntervalMs: BATCH_INTERVAL_MS,
	instrumentCount: 2,
	updatesPerBatch: UPDATES_PER_BATCH,
};

const alfaStats = (trades: number) => ({
	askCents: 10200,
	askQuantity: 400,
	bidCents: 10196,
	bidQuantity: 600,
	lastPriceCents: 10200,
	notionalCents: 306000 * trades,
	symbol: 'ALFA',
	volume: 30 * trades,
});

const emptyBetaStats = {
	askCents: null,
	askQuantity: null,
	bidCents: null,
	bidQuantity: null,
	lastPriceCents: null,
	notionalCents: 0,
	symbol: 'BETA',
	volume: 0,
};

describe(MarketProducer, () => {
	let generator: MarketBatchGeneratorMock;
	let createGenerator: Mock<(instrumentCount: number) => MarketBatchGenerator>;
	let post: Mock<(event: ProducerEvent) => void>;
	let producer: MarketProducer;

	beforeEach(() => {
		vi.useFakeTimers();
		generator = new MarketBatchGeneratorMock();
		createGenerator = vi.fn<(instrumentCount: number) => MarketBatchGenerator>(() => generator);
		post = vi.fn<(event: ProducerEvent) => void>();
		producer = new MarketProducer(createGenerator, post);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should generate one batch of the requested size per interval and post cumulative stats', () => {
		producer.handle({ runId: 1, settings, type: 'start' });
		vi.advanceTimersByTime(BATCH_INTERVAL_MS * 3);

		expect(createGenerator).toHaveBeenCalledWith(settings.instrumentCount);
		expect(generator.nextBatch).toHaveBeenCalledTimes(3);
		expect(generator.nextBatch).toHaveBeenCalledWith(UPDATES_PER_BATCH);
		expect(post).toHaveBeenLastCalledWith({ runId: 1, stats: [alfaStats(3), emptyBetaStats], type: 'snapshot' });
	});

	it('should stop generating while paused and resume without catching up on the paused time', () => {
		producer.handle({ runId: 1, settings, type: 'start' });
		vi.advanceTimersByTime(BATCH_INTERVAL_MS);
		producer.handle({ type: 'pause' });
		vi.advanceTimersByTime(BATCH_INTERVAL_MS * 10);

		expect(generator.nextBatch).toHaveBeenCalledTimes(1);

		producer.handle({ type: 'resume' });
		vi.advanceTimersByTime(BATCH_INTERVAL_MS);

		expect(generator.nextBatch).toHaveBeenCalledTimes(2);
		expect(post).toHaveBeenLastCalledWith({ runId: 1, stats: [alfaStats(2), emptyBetaStats], type: 'snapshot' });
	});

	it('should keep a single timer when resumed while already running', () => {
		producer.handle({ runId: 1, settings, type: 'start' });
		producer.handle({ type: 'resume' });
		vi.advanceTimersByTime(BATCH_INTERVAL_MS);

		expect(generator.nextBatch).toHaveBeenCalledTimes(1);
	});

	it('should free the previous generator and start from empty totals on a new run', () => {
		const nextGenerator = new MarketBatchGeneratorMock();
		const twoRunProducer = new MarketProducer(
			vi
				.fn<(instrumentCount: number) => MarketBatchGenerator>()
				.mockReturnValueOnce(generator)
				.mockReturnValueOnce(nextGenerator),
			post
		);

		twoRunProducer.handle({ runId: 1, settings, type: 'start' });
		vi.advanceTimersByTime(BATCH_INTERVAL_MS * 2);
		twoRunProducer.handle({ runId: 2, settings, type: 'start' });
		vi.advanceTimersByTime(BATCH_INTERVAL_MS);

		expect(generator.free).toHaveBeenCalledTimes(1);
		expect(generator.nextBatch).toHaveBeenCalledTimes(2);
		expect(post).toHaveBeenLastCalledWith({ runId: 2, stats: [alfaStats(1), emptyBetaStats], type: 'snapshot' });
	});

	it('should start generating for a new run even when the previous run was paused', () => {
		producer.handle({ runId: 1, settings, type: 'start' });
		producer.handle({ type: 'pause' });
		producer.handle({ runId: 2, settings, type: 'start' });
		vi.advanceTimersByTime(BATCH_INTERVAL_MS);

		expect(post).toHaveBeenLastCalledWith({ runId: 2, stats: [alfaStats(1), emptyBetaStats], type: 'snapshot' });
	});

	it('should report an error and generate nothing when the generator cannot be created', () => {
		const failingProducer = new MarketProducer(() => {
			throw new Error('instrument count must be between 1 and 50, got 0');
		}, post);

		failingProducer.handle({ runId: 1, settings, type: 'start' });
		failingProducer.handle({ type: 'resume' });
		vi.advanceTimersByTime(BATCH_INTERVAL_MS * 2);

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
		vi.advanceTimersByTime(BATCH_INTERVAL_MS * 3);

		expect(failingGenerator.nextBatch).toHaveBeenCalledTimes(1);
		expect(post).toHaveBeenCalledWith({ message: 'memory access out of bounds', runId: 1, type: 'error' });
	});
});
