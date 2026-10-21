import { Locator, page } from 'vitest/browser';

export class DashboardPageComponentPO {
	public get title(): Locator {
		return page.getByTestId('dashboard-page-title');
	}

	public get status(): Locator {
		return page.getByTestId('dashboard-page-status');
	}

	public get rate(): Locator {
		return page.getByTestId('dashboard-page-rate');
	}

	public get toggle(): Locator {
		return page.getByTestId('dashboard-page-toggle');
	}

	public get error(): Locator {
		return page.getByTestId('dashboard-page-error');
	}

	public get table(): Locator {
		return page.getByTestId('dashboard-page-table');
	}

	public get caption(): Locator {
		return page.getByTestId('dashboard-page-caption');
	}

	public get rows(): Locator {
		return page.getByTestId('dashboard-page-row');
	}

	public get rowTexts(): string[][] {
		return this.rows.all().map(row =>
			row
				.getByTestId('dashboard-page-cell')
				.elements()
				.map(cell => cell.textContent.trim())
		);
	}

	public async togglePause(): Promise<void> {
		await this.toggle.click();
	}
}
