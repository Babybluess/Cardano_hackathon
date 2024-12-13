use cardano/assets.{PolicyId, AssetName}
use aiken/crypto.{Blake2b_224, Hash, VerificationKey}

pub type VerificationKeyHash =
  Hash<Blake2b_224, VerificationKey>

pub type Deadline = Int

pub type MarketDatum {
    policyId: PolicyId, 
    assetName: AssetName,
    seller: VerificationKeyHash,
    price: Int,
    expire: Deadline,
    auctioneer: VerificationKeyHash
}

pub type MarketAction {
  MBuy
  MEdit { price: Int }
  MBid { bid_price: Int, auctioneer: VerificationKeyHash }
  MDelist
  MClaim
}