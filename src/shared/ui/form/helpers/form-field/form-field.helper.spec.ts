import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FieldTree, form, required } from '@angular/forms/signals';

import { FormFieldHelper } from './form-field.helper';

describe(FormFieldHelper, () => {
	let nameForm: FieldTree<{ name: string }>;

	beforeEach(() => {
		nameForm = TestBed.runInInjectionContext(() =>
			form(signal({ name: '' }), ({ name }) => {
				required(name);
			})
		);
	});

	describe('showsError', () => {
		it('should hide the error of an invalid field the user has not left yet', () => {
			expect(FormFieldHelper.showsError(nameForm.name())).toBe(false);
		});

		it('should show the error of an invalid field the user has left', () => {
			nameForm.name().markAsTouched();

			expect(FormFieldHelper.showsError(nameForm.name())).toBe(true);
		});
	});

	describe('errorId', () => {
		it('should derive the error id from the unique field name', () => {
			expect(FormFieldHelper.errorId(nameForm.name())).toBe(`${nameForm.name().name()}.error`);
		});
	});
});
