import { Directive, inject, TemplateRef, ViewContainerRef } from '@angular/core';

import { MarketFeedService } from '../../services';
import { MarketFeedContext } from '../../models';

@Directive({ selector: '[appMarketFeed]' })
export class MarketFeedDirective {
	private readonly _templateRef = inject<TemplateRef<MarketFeedContext>>(TemplateRef);
	private readonly _viewContainerRef = inject(ViewContainerRef);
	private readonly _marketFeedService = inject(MarketFeedService);

	constructor() {
		this._setup();
	}

	private _setup(): void {
		this._viewContainerRef.createEmbeddedView(this._templateRef, { $implicit: this._marketFeedService });
	}

	public static ngTemplateContextGuard(
		_directive: MarketFeedDirective,
		_context: unknown
	): _context is MarketFeedContext {
		return true;
	}
}
