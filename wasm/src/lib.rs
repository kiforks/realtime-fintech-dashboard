mod market;

use market::Market;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct MarketGenerator {
    market: Market,
}

#[wasm_bindgen]
impl MarketGenerator {
    #[wasm_bindgen(constructor)]
    pub fn new(instrument_count: u32, seed: u32) -> Result<MarketGenerator, JsError> {
        Market::new(instrument_count, u64::from(seed))
            .map(|market| Self { market })
            .map_err(|message| JsError::new(&message))
    }

    #[wasm_bindgen(js_name = nextBatch)]
    pub fn next_batch(&mut self, size: u32) -> Result<Vec<u32>, JsError> {
        self.market
            .next_batch(size)
            .map_err(|message| JsError::new(&message))
    }
}
