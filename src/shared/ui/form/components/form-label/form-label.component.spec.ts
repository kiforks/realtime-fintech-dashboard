import { TestBed } from '@angular/core/testing';

import { FormLabelHostSpecComponent } from './form-label-host.spec.component';
import { FormLabelComponent } from './form-label.component';
import { FormLabelComponentPO } from './form-label.component.po';

describe(FormLabelComponent, () => {
	let formLabelPO: FormLabelComponentPO;

	beforeEach(() => {
		TestBed.createComponent(FormLabelHostSpecComponent);
		formLabelPO = new FormLabelComponentPO();
	});

	it('should name the input of its field', async () => {
		await expect.element(formLabelPO.input).toHaveAccessibleName('Age');
	});
});
