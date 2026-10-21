import { Locator, page } from 'vitest/browser';

export class FormLabelComponentPO {
	public get input(): Locator {
		return page.getByTestId('form-label-input');
	}
}
