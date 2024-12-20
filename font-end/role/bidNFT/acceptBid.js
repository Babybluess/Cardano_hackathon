import { signAndConfirmTransactionFe } from "../createNFT/ultilityFunc";

const callback = (signature, result) => {
  console.log("Signature ", signature);
  console.log("result ", result);
};

function acceptBid(network, bid_state, seller, marketNFT) {
  const axios = require("axios");
   
   let data = JSON.stringify({
     "network": network,
     "marketplace_address": marketNFT,
     "bid_state": bid_state,
     "seller_wallet": seller
   });
   
   let config = {
     method: "post",
     maxBodyLength: Infinity,
     url: "https://api.shyft.to/sol/v1/marketplace/accept_bid",
     headers: { 
       "Content-Type": "application/json", 
       "x-api-key": process.env.NEXT_PUBLIC_API_KEY

     },
     data : data
   };
   
   axios.request(config)
   .then(async(res) => {
      console.log(res);
               if (res.data.success === true) {
                  const transaction = res.data.result.encoded_transaction;
                  const ret_result = await signAndConfirmTransactionFe(
                     network,
                     transaction,
                     callback,
                  );
                  console.log(ret_result);
               }
   })
   .catch((error) => {
     console.log(error);
   });
   
}

export default acceptBid