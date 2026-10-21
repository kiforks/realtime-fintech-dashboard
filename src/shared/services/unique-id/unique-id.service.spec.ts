import { TestBed } from '@angular/core/testing';

import { UniqueIdService } from './unique-id.service';

describe(UniqueIdService, () => {
	let uniqueIdService: UniqueIdService;

	beforeEach(() => {
		uniqueIdService = TestBed.inject(UniqueIdService);
	});

	it('should give every request its own id with the requested prefix', () => {
		const ids = [uniqueIdService.next('caption'), uniqueIdService.next('caption'), uniqueIdService.next('hint')];

		expect(ids).toStrictEqual(['caption-1', 'caption-2', 'hint-3']);
	});
});
