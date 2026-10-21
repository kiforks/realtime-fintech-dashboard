import { computed, Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Field } from '@angular/forms/signals';

import { FormFieldHelper } from '../../helpers';
import { FormIfInvalidContext } from '../../models';

@Directive({ selector: '[appFormIfInvalid]' })
export class FormIfInvalidDirective {
	public readonly field = input.required<Field<unknown>>({ alias: 'appFormIfInvalid' });
	private readonly _templateRef = inject<TemplateRef<FormIfInvalidContext>>(TemplateRef);
	private readonly _viewContainerRef = inject(ViewContainerRef);
	private readonly _state = computed(() => this.field()());
	private readonly _showsError = computed(() => FormFieldHelper.showsError(this._state()));

	constructor() {
		this._setup();
	}

	private _setup(): void {
		effect(() => {
			this._render(this._showsError());
		});
	}

	private _render(showsError: boolean): void {
		this._viewContainerRef.clear();

		if (showsError) {
			this._viewContainerRef.createEmbeddedView(this._templateRef, { $implicit: this._state() });
		}
	}

	public static ngTemplateContextGuard(
		_directive: FormIfInvalidDirective,
		_context: unknown
	): _context is FormIfInvalidContext {
		return true;
	}
}
