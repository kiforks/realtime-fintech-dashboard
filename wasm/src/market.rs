use rand_core::{Rng, SeedableRng};
use rand_pcg::Pcg32;

pub const STRIDE: usize = 7;
pub const MAX_INSTRUMENTS: u32 = 50;
pub const MAX_BATCH_SIZE: u32 = 1_000;

const MIN_MID_CENTS: i64 = 1_000;
const MAX_MID_CENTS: i64 = 100_000;
const INITIAL_MID_CENTS: (i64, i64) = (2_000, 50_000);
const MID_STEP_DIVISOR: i64 = 2_000;
const SPREAD_DIVISOR: i64 = 1_000;
const MAX_TRADE_QUANTITY: i64 = 100;
const MAX_BOOK_QUANTITY: i64 = 5_000;
const INITIAL_BOOK_QUANTITY: (i64, i64) = (100, 1_000);
const BOOK_STEP: i64 = 50;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct MarketUpdate {
    pub instrument: u32,
    pub price_cents: u32,
    pub trade_quantity: u32,
    pub bid_cents: u32,
    pub ask_cents: u32,
    pub bid_quantity: u32,
    pub ask_quantity: u32,
}

impl MarketUpdate {
    fn to_fields(self) -> [u32; STRIDE] {
        [
            self.instrument,
            self.price_cents,
            self.trade_quantity,
            self.bid_cents,
            self.ask_cents,
            self.bid_quantity,
            self.ask_quantity,
        ]
    }
}

struct Instrument {
    mid_cents: i64,
    bid_quantity: i64,
    ask_quantity: i64,
}

impl Instrument {
    fn new(rng: &mut Pcg32) -> Self {
        Self {
            mid_cents: between(rng, INITIAL_MID_CENTS.0, INITIAL_MID_CENTS.1),
            bid_quantity: between(rng, INITIAL_BOOK_QUANTITY.0, INITIAL_BOOK_QUANTITY.1),
            ask_quantity: between(rng, INITIAL_BOOK_QUANTITY.0, INITIAL_BOOK_QUANTITY.1),
        }
    }

    fn step(&mut self, rng: &mut Pcg32, instrument: u32) -> MarketUpdate {
        let mid_step = (self.mid_cents / MID_STEP_DIVISOR).max(1);

        self.mid_cents = (self.mid_cents + between(rng, -mid_step, mid_step))
            .clamp(MIN_MID_CENTS, MAX_MID_CENTS);

        let spread = between(rng, 1, (self.mid_cents / SPREAD_DIVISOR).max(1));
        let bid_cents = self.mid_cents - spread / 2;
        let ask_cents = bid_cents + spread;
        let price_cents = if below(rng, 2) == 0 {
            bid_cents
        } else {
            ask_cents
        };
        let trade_quantity = between(rng, 1, MAX_TRADE_QUANTITY);

        self.bid_quantity = walk_book_quantity(rng, self.bid_quantity);
        self.ask_quantity = walk_book_quantity(rng, self.ask_quantity);

        MarketUpdate {
            instrument,
            price_cents: price_cents as u32,
            trade_quantity: trade_quantity as u32,
            bid_cents: bid_cents as u32,
            ask_cents: ask_cents as u32,
            bid_quantity: self.bid_quantity as u32,
            ask_quantity: self.ask_quantity as u32,
        }
    }
}

pub struct Market {
    rng: Pcg32,
    instruments: Vec<Instrument>,
}

impl Market {
    pub fn new(instrument_count: u32, seed: u64) -> Result<Self, String> {
        if !(1..=MAX_INSTRUMENTS).contains(&instrument_count) {
            return Err(format!(
                "instrument count must be between 1 and {MAX_INSTRUMENTS}, got {instrument_count}"
            ));
        }

        let mut rng = Pcg32::seed_from_u64(seed);
        let instruments = (0..instrument_count)
            .map(|_| Instrument::new(&mut rng))
            .collect();

        Ok(Self { rng, instruments })
    }

    pub fn next_batch(&mut self, size: u32) -> Result<Vec<u32>, String> {
        if !(1..=MAX_BATCH_SIZE).contains(&size) {
            return Err(format!(
                "batch size must be between 1 and {MAX_BATCH_SIZE}, got {size}"
            ));
        }

        let mut batch = Vec::with_capacity(size as usize * STRIDE);

        for _ in 0..size {
            batch.extend_from_slice(&self.next_update().to_fields());
        }

        Ok(batch)
    }

    fn next_update(&mut self) -> MarketUpdate {
        let index = below(&mut self.rng, self.instruments.len() as u32);

        self.instruments[index as usize].step(&mut self.rng, index)
    }
}

fn below(rng: &mut Pcg32, bound: u32) -> u32 {
    ((u64::from(rng.next_u32()) * u64::from(bound)) >> 32) as u32
}

fn between(rng: &mut Pcg32, low: i64, high: i64) -> i64 {
    low + i64::from(below(rng, (high - low + 1) as u32))
}

fn walk_book_quantity(rng: &mut Pcg32, quantity: i64) -> i64 {
    (quantity + between(rng, -BOOK_STEP, BOOK_STEP)).clamp(0, MAX_BOOK_QUANTITY)
}

#[cfg(test)]
mod tests {
    use std::collections::BTreeSet;

    use super::*;

    const SEED: u64 = 42;

    fn decode(batch: &[u32]) -> Vec<MarketUpdate> {
        batch
            .as_chunks::<STRIDE>()
            .0
            .iter()
            .map(
                |&[
                    instrument,
                    price_cents,
                    trade_quantity,
                    bid_cents,
                    ask_cents,
                    bid_quantity,
                    ask_quantity,
                ]| {
                    MarketUpdate {
                        instrument,
                        price_cents,
                        trade_quantity,
                        bid_cents,
                        ask_cents,
                        bid_quantity,
                        ask_quantity,
                    }
                },
            )
            .collect()
    }

    fn breaks_an_invariant(update: &MarketUpdate, instrument_count: u32) -> bool {
        let has_valid_instrument = update.instrument < instrument_count;
        let has_positive_bid = update.bid_cents >= 1;
        let has_bid_below_ask = update.bid_cents < update.ask_cents;
        let trades_at_a_quote =
            update.price_cents == update.bid_cents || update.price_cents == update.ask_cents;
        let has_valid_trade_quantity =
            (1..=MAX_TRADE_QUANTITY as u32).contains(&update.trade_quantity);
        let has_bounded_book = update.bid_quantity <= MAX_BOOK_QUANTITY as u32
            && update.ask_quantity <= MAX_BOOK_QUANTITY as u32;

        !(has_valid_instrument
            && has_positive_bid
            && has_bid_below_ask
            && trades_at_a_quote
            && has_valid_trade_quantity
            && has_bounded_book)
    }

    #[test]
    fn returns_exactly_the_requested_number_of_updates() {
        let mut market = Market::new(MAX_INSTRUMENTS, SEED).unwrap();

        let lengths: Vec<usize> = [1, 100, MAX_BATCH_SIZE]
            .map(|size| market.next_batch(size).unwrap().len())
            .to_vec();

        assert_eq!(lengths, vec![STRIDE, 100 * STRIDE, 1_000 * STRIDE]);
    }

    #[test]
    fn keeps_every_invariant_over_many_updates() {
        let violations: Vec<MarketUpdate> = (1..=4)
            .flat_map(|seed| {
                let mut market = Market::new(MAX_INSTRUMENTS, seed).unwrap();

                (0..200_000).map(move |_| market.next_update())
            })
            .filter(|update| breaks_an_invariant(update, MAX_INSTRUMENTS))
            .collect();

        assert_eq!(violations, vec![]);
    }

    #[test]
    fn moves_each_mid_price_by_at_most_one_step_per_update() {
        let mut market = Market::new(3, SEED).unwrap();

        let jumps: Vec<(i64, i64)> = (0..30_000)
            .filter_map(|_| {
                let before: Vec<i64> = market
                    .instruments
                    .iter()
                    .map(|instrument| instrument.mid_cents)
                    .collect();
                let update = market.next_update();
                let previous = before[update.instrument as usize];
                let current = market.instruments[update.instrument as usize].mid_cents;
                let max_step = (previous / MID_STEP_DIVISOR).max(1);

                ((current - previous).abs() > max_step).then_some((previous, current))
            })
            .collect();

        assert_eq!(jumps, vec![]);
    }

    #[test]
    fn keeps_instrument_state_between_batches() {
        let mut split = Market::new(MAX_INSTRUMENTS, SEED).unwrap();
        let mut whole = Market::new(MAX_INSTRUMENTS, SEED).unwrap();

        let mut split_batches = split.next_batch(500).unwrap();

        split_batches.extend(split.next_batch(500).unwrap());

        assert_eq!(split_batches, whole.next_batch(1_000).unwrap());
    }

    #[test]
    fn repeats_the_same_updates_for_the_same_seed() {
        let mut first = Market::new(5, SEED).unwrap();
        let mut second = Market::new(5, SEED).unwrap();

        assert_eq!(
            first.next_batch(100).unwrap(),
            second.next_batch(100).unwrap()
        );
    }

    #[test]
    fn produces_different_updates_for_different_seeds() {
        let mut first = Market::new(5, 1).unwrap();
        let mut second = Market::new(5, 2).unwrap();

        assert_ne!(
            first.next_batch(100).unwrap(),
            second.next_batch(100).unwrap()
        );
    }

    #[test]
    fn rejects_instrument_counts_outside_the_allowed_range() {
        let errors: Vec<Option<String>> = [0, 1, MAX_INSTRUMENTS, MAX_INSTRUMENTS + 1]
            .map(|count| Market::new(count, SEED).err())
            .to_vec();

        assert_eq!(
            errors,
            vec![
                Some(String::from(
                    "instrument count must be between 1 and 50, got 0"
                )),
                None,
                None,
                Some(String::from(
                    "instrument count must be between 1 and 50, got 51"
                )),
            ]
        );
    }

    #[test]
    fn rejects_batch_sizes_outside_the_allowed_range() {
        let mut market = Market::new(MAX_INSTRUMENTS, SEED).unwrap();

        let errors: Vec<Option<String>> = [0, 1, MAX_BATCH_SIZE, MAX_BATCH_SIZE + 1]
            .map(|size| market.next_batch(size).err())
            .to_vec();

        assert_eq!(
            errors,
            vec![
                Some(String::from("batch size must be between 1 and 1000, got 0")),
                None,
                None,
                Some(String::from(
                    "batch size must be between 1 and 1000, got 1001"
                )),
            ]
        );
    }

    #[test]
    fn selects_every_instrument_and_may_repeat_one_within_a_batch() {
        let mut market = Market::new(MAX_INSTRUMENTS, SEED).unwrap();
        let instruments: Vec<u32> = decode(&market.next_batch(1_000).unwrap())
            .iter()
            .map(|update| update.instrument)
            .collect();

        let distinct: BTreeSet<u32> = instruments.iter().copied().collect();

        assert_eq!(distinct, (0..MAX_INSTRUMENTS).collect::<BTreeSet<u32>>());
        assert!(instruments.len() > distinct.len());
    }

    #[test]
    fn keeps_prices_inside_the_band_at_its_edges() {
        let mut market = Market::new(2, SEED).unwrap();

        market.instruments[0].mid_cents = MIN_MID_CENTS;
        market.instruments[1].mid_cents = MAX_MID_CENTS;

        let outside_band: Vec<i64> = (0..10_000)
            .filter_map(|_| {
                let update = market.next_update();
                let mid = market.instruments[update.instrument as usize].mid_cents;

                (!(MIN_MID_CENTS..=MAX_MID_CENTS).contains(&mid)).then_some(mid)
            })
            .collect();

        assert_eq!(outside_band, vec![]);
    }

    #[test]
    fn can_empty_both_sides_of_the_book() {
        let mut market = Market::new(1, SEED).unwrap();

        market.instruments[0].bid_quantity = 0;
        market.instruments[0].ask_quantity = 0;

        let empty_books = (0..100_000)
            .map(|_| market.next_update())
            .filter(|update| update.bid_quantity == 0 && update.ask_quantity == 0)
            .count();

        assert!(empty_books > 0);
    }
}
