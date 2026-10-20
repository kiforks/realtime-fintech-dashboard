export interface MarketBatchGenerator {
	free(): void;
	nextBatch(size: number): Uint32Array;
}
