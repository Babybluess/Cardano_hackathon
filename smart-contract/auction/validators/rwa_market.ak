use aiken/collection/list
use aiken/primitive/string
use cardano/address.{VerificationKey}
use cardano/assets
use cardano/transaction.{InlineDatum, OutputReference, Transaction}
use types.{MBuy, MDelist, MEdit, MBid, MClaim, MarketAction, MarketDatum}
use utils.{must_be_progress}

validator market {
  spend(
    datum: Option<MarketDatum>,
    r: MarketAction,
    oref: OutputReference,
    tx: Transaction,
  ) {

    expect Some(d) = datum

    when r is {
      MBuy -> {
        // seller gets paid the listed amount
        expect Some(payment) =
          // output to seller address
          list.find(
            tx.outputs,
            fn(output) {
              output.address.payment_credential == VerificationKey(d.seller)
            },
          )

        trace string.concat(
          @"Buying asset for: ",
          string.from_int(assets.lovelace_of(payment.value)),
        )

        // payment value is correct
        assets.lovelace_of(payment.value) == d.price
      }
      MEdit { price } -> {
        // change MarketDatum.price -> return to marketplace
        expect Some(ownInput) =
          list.find(tx.inputs, fn(input) { input.output_reference == oref })

        let ownHash = ownInput.output.address.payment_credential

        // script Output has same Value as input
        expect Some(ownOutput) =
          list.find(
            tx.outputs,
            fn(output) {
              output.address.payment_credential == ownHash && output.value == ownInput.output.value
            },
          )

        // check output Datum is MarketDatum
        expect InlineDatum(datum) = ownOutput.datum
        expect newDatum: MarketDatum = datum

        trace string.concat(
          @"Editing price to: ",
          string.from_int(newDatum.price),
        )

        // check newDatum Values && signature
        and {
          newDatum.seller == d.seller,
          newDatum.price == price,
          list.has(tx.extra_signatories, d.seller),
        }
      }
      MBid { bid_price, auctioneer } -> {
        expect Some(ownInput) =
          list.find(tx.inputs, fn(input) { input.output_reference == oref })

        let ownHash = ownInput.output.address.payment_credential
        let is_progress = must_be_progress(tx.validity_range, d.expire)

        // script Output has same Value as input
        expect Some(ownOutput) =
          list.find(
            tx.outputs,
            fn(output) {
              output.address.payment_credential == ownHash && output.value == ownInput.output.value
            },
          )

        // check output Datum is MarketDatum
        expect InlineDatum(datum) = ownOutput.datum
        expect newDatum: MarketDatum = datum

        trace string.concat(
          @"Bidding price to: ",
          string.from_int(newDatum.price),
        )

        // check newDatum Values && signature
        and {
          newDatum.seller == d.seller,
          newDatum.price == bid_price,
          newDatum.auctioneer == auctioneer,
          list.has(tx.extra_signatories, d.seller),
          is_progress
        }
      }
      MDelist -> {
        trace @"Delisting asset"
        // Only if signed by Seller
        list.has(tx.extra_signatories, d.seller)?
      }
      MClaim -> {
        let is_progress = must_be_progress(tx.validity_range, d.expire)

        when is_progress is {
          True -> False
          False -> {
             // auctioneer gets paid the listed amount
            expect Some(payment) =
              // output to auctioneer address
              list.find(
                tx.outputs,
                fn(output) {
                  output.address.payment_credential == VerificationKey(d.auctioneer)
                },
              )

            trace string.concat(
              @"Bidding asset for: ",
              string.from_int(assets.lovelace_of(payment.value)),
            )

            // payment value is correct
            assets.lovelace_of(payment.value) == d.price
          }
        }
      }
    }
  }

  else(_) {
    fail
  }
}