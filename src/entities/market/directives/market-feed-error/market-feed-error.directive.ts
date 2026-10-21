import { Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';

import { MarketFeedService } from '../../services';
import { MarketFeedErrorContext } from '../../models';

@Directive({ selector: '[appMarketFeedError]' })
export class MarketFeedErrorDirective {
	private readonly _templateRef = inject<TemplateRef<MarketFeedErrorContext>>(TemplateRef);
	private readonly _viewContainerRef = inject(ViewContainerRef);
	private readonly _marketFeedService = inject(MarketFeedService);

	constructor() {
		this._setup();
	}

	private _setup(): void {
		effect(() => {
			this._render(this._marketFeedService.errorMessage());
		});
	}

	private _render(errorMessage: string | null): void {
		this._viewContainerRef.clear();

		if (errorMessage !== null) {
			this._viewContainerRef.createEmbeddedView(this._templateRef, { $implicit: errorMessage });
		}
	}

	public static ngTemplateContextGuard(
		_directive: MarketFeedErrorDirective,
		_context: unknown
	): _context is MarketFeedErrorContext {
		return true;
	}
}
