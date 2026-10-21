import { Service } from '@angular/core';

@Service()
export class UniqueIdService {
	private _count = 0;

	public next(prefix: string): string {
		this._count += 1;

		return `${prefix}-${this._count}`;
	}
}
