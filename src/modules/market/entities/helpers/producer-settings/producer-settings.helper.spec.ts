import { ProducerSettingsHelper } from './producer-settings.helper';

describe(ProducerSettingsHelper, () => {
	describe('fromDraft', () => {
		it('should turn a complete draft into producer settings', () => {
			expect(
				ProducerSettingsHelper.fromDraft({ batchIntervalMs: 50, instrumentCount: 10, updatesPerBatch: 1000 })
			).toStrictEqual({ batchIntervalMs: 50, instrumentCount: 10, updatesPerBatch: 1000 });
		});

		it.each([
			{ batchIntervalMs: null, instrumentCount: 10, updatesPerBatch: 1000 },
			{ batchIntervalMs: 50, instrumentCount: null, updatesPerBatch: 1000 },
			{ batchIntervalMs: 50, instrumentCount: 10, updatesPerBatch: null },
		])('should reject a draft with an empty field', draft => {
			expect(ProducerSettingsHelper.fromDraft(draft)).toBeNull();
		});
	});
});
