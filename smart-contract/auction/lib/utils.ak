use aiken/interval.{Finite}
use cardano/transaction.{ValidityRange}
use types.{Deadline}

pub fn must_be_progress(range: ValidityRange, lock_expiration_time: Deadline) {
  when range.lower_bound.bound_type is {
    Finite(tx_earliest_time) ->  tx_earliest_time < lock_expiration_time
    _ -> False
  }
}