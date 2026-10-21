import { Locator, page } from 'vitest/browser';

export class FormErrorComponentPO {
	public get error(): Locator {
		return page.getByTestId('form-error');
	}
}
