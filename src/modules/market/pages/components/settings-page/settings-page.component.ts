import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, FormRoot, max, min, required, SchemaPath, validate } from '@angular/forms/signals';

import { MarketRouteConfig } from '../../configs';

import {
	IntegerRange,
	MarketFeedService,
	ProducerSettingsConfig,
	ProducerSettingsDraft,
	ProducerSettingsHelper,
} from '~modules/market/entities';

const requireIntegerInRange = (
	path: SchemaPath<number | null>,
	{ max: maxValue, min: minValue }: IntegerRange
): void => {
	required(path);
	min(path, minValue);
	max(path, maxValue);
	validate(path, ({ value }) => {
		const current = value();

		return current === null || Number.isInteger(current) ? null : { kind: 'integer' };
	});
};

@Component({
	selector: 'app-settings-page',
	imports: [FormField, FormRoot],
	templateUrl: './settings-page.component.html',
	styleUrl: './settings-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
	protected readonly ranges = {
		batchIntervalMs: ProducerSettingsConfig.BatchIntervalMs,
		instrumentCount: ProducerSettingsConfig.InstrumentCount,
		updatesPerBatch: ProducerSettingsConfig.UpdatesPerBatch,
	};

	protected readonly settingsForm = form(
		signal<ProducerSettingsDraft>({ ...inject(MarketFeedService).settings() }),
		path => {
			requireIntegerInRange(path.instrumentCount, ProducerSettingsConfig.InstrumentCount);
			requireIntegerInRange(path.updatesPerBatch, ProducerSettingsConfig.UpdatesPerBatch);
			requireIntegerInRange(path.batchIntervalMs, ProducerSettingsConfig.BatchIntervalMs);
		},
		{ submission: { action: field => this._apply(field().value()) } }
	);

	private readonly _marketFeedService = inject(MarketFeedService);
	private readonly _router = inject(Router);

	private async _apply(draft: ProducerSettingsDraft): Promise<void> {
		const settings = ProducerSettingsHelper.fromDraft(draft);

		if (settings === null) {
			return;
		}

		this._marketFeedService.apply(settings);
		await this._router.navigate(['/', MarketRouteConfig.Dashboard]);
	}
}
