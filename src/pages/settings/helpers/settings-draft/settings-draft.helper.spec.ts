import { SettingsDraftHelper } from './settings-draft.helper';

describe(SettingsDraftHelper, () => {
	describe('toFeedSettings', () => {
		it('should turn a complete draft into feed settings', () => {
			expect(
				SettingsDraftHelper.toFeedSettings({ batchIntervalMs: 50, instrumentCount: 10, updatesPerBatch: 1000 })
			).toStrictEqual({ batchIntervalMs: 50, instrumentCount: 10, updatesPerBatch: 1000 });
		});

		it.each([
			{ batchIntervalMs: null, instrumentCount: 10, updatesPerBatch: 1000 },
			{ batchIntervalMs: 50, instrumentCount: null, updatesPerBatch: 1000 },
			{ batchIntervalMs: 50, instrumentCount: 10, updatesPerBatch: null },
		])('should reject a draft with an empty field', draft => {
			expect(SettingsDraftHelper.toFeedSettings(draft)).toBeNull();
		});
	});
});
