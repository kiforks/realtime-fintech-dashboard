import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, FormRoot } from '@angular/forms/signals';

import { SettingsDraftHelper } from '../../helpers';
import { SettingsDraft } from '../../models';

import { SETTINGS_FORM_SCHEMA } from '../../schemas';

import { MarketFeedService } from '~/entities/market';
import { AppRouteConfig } from '~/shared/configs';
import { ButtonComponent } from '~/shared/ui/button';
import {
	FormComponent,
	FormErrorComponent,
	FormIfInvalidDirective,
	FormInputComponent,
	FormLabelComponent,
} from '~/shared/ui/form';
import { NoteComponent } from '~/shared/ui/note';
import { PageHeaderComponent, PageTitleComponent } from '~/shared/ui/page';

@Component({
	selector: 'app-settings-page',
	imports: [
		ButtonComponent,
		FormComponent,
		FormErrorComponent,
		FormField,
		FormIfInvalidDirective,
		FormInputComponent,
		FormLabelComponent,
		FormRoot,
		NoteComponent,
		PageHeaderComponent,
		PageTitleComponent,
	],
	templateUrl: './settings-page.component.html',
})
export class SettingsPageComponent {
	protected readonly settingsForm = form(
		signal<SettingsDraft>({ ...inject(MarketFeedService).settings() }),
		SETTINGS_FORM_SCHEMA,
		{ submission: { action: field => this._apply(field().value()) } }
	);

	private readonly _marketFeedService = inject(MarketFeedService);
	private readonly _router = inject(Router);

	private async _apply(draft: SettingsDraft): Promise<void> {
		const settings = SettingsDraftHelper.toFeedSettings(draft);

		if (settings === null) {
			return;
		}

		this._marketFeedService.apply(settings);
		await this._router.navigate(['/', AppRouteConfig.Dashboard]);
	}
}
