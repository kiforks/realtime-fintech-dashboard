export abstract class NumberFormatConfig {
	public static readonly CentsPerDollar = 100;
	public static readonly Currency = new Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency' });
	public static readonly SignedRatio = new Intl.NumberFormat('en-US', {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
		signDisplay: 'exceptZero',
	});

	public static unavailableValue(): string {
		return $localize`:Shown instead of a value that cannot be calculated yet@@unavailableValue:—`;
	}
}
