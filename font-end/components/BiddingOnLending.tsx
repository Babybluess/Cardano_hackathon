"use client";
import React, { useEffect, useState } from "react";
import acceptBid from "@/role/bidNFT/acceptBid";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cancelBid from "@/role/bidNFT/cancelBid";
import { getCurrentNFTBorrow } from "@/script/action/vault/vaultAction";
import { useDispatch } from "react-redux";
import { assetService } from "@/service";
import { useWallet } from "@meshsdk/react";
import { TAsset } from "@/types/user.type";
import { bidAsset } from "@/role/AuctionStage/bidAsset";
import { handleSendLovelace } from "@/role/AuctionStage/sendLovelace";

function BiddingOnLending() {
   const [nftBid, setNFTBid] = useState<any[]>([]);
   const axios = require("axios");
   const { wallet } = useWallet();
   const [assets, setAssets] = useState<TAsset[]>([]);
   const [address, setAddress] = useState("");
   const [price, setPrice] = useState(0);

   const titleList = [
      "Image",
      "Name",
      "Lender",
      "Borrower",
      "EPrice",
      "Expiration",
      "Accept",
      "Refuse",
   ];

   useEffect(() => {
      const data = async () => {
         const address = await wallet.getUsedAddresses();
         const assetLists: TAsset[] = await assetService.getAllOwnAsset(address[0]);
         const allAssets: TAsset[] = await assetService.getAllAsset();
         const notOwnAssets = allAssets.filter(
            (item) => !assetLists.includes(item) && item.highest_bid > 0,
         );

         setAddress(address[0]);
         setAssets(notOwnAssets);

         console.log(notOwnAssets);
      };

      data();
   }, []);

   const handleBid = async (asset: TAsset) => {
      if (price == 0) {
         alert("Please set price for nft");
      } else {
         const list = await bidAsset(wallet, asset, price);
         const purchase = await handleSendLovelace(wallet, asset.userId, price);
         setTimeout(() => {
            toast.success("🦄 It is successfull bidding!", {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "dark",
               transition: Bounce,
            });
         }, 15000);
      }
   };

   return (
      <div className="w-full min-h-[80vh] z-30 flex flex-col gap-5 items-center text-white px-10 py-5 border-x-4 border-[#F7F7F9]">
         <p className=" text-4xl font-semibold">Auction NFT</p>

         <div className="w-full h-full">
            {address.length > 0 && (
               <div className="w-full flex flex-wrap gap-5">
                  {assets &&
                     assets.map((nft: TAsset, index: number) => (
                        <div
                           key={index}
                           className={
                              "w-[300px] h-[450px] shadow-inner shadow-indigo-500 flex flex-col justify-center items-center border-2 border-[#5B3BA8] rounded-md bg-[#28262F] relative"
                           }
                        >
                           <div className=" w-[30%] text-center absolute left-0 top-0 z-40 text-white font-medium rounded-br-xl bg-[#5C3CA8]">
                              <p>{nft.type}</p>
                           </div>
                           <div
                              className={
                                 "w-full h-[65vh] px-5 py-2  flex flex-col text-white rounded-t-xl"
                              }
                           >
                              {/* <div className=" w-full h-[65%] rounded-t-xl flex justify-center items-center">
                              </div> */}
                              <img
                                 className=" w-full h-[65%] py-1 rounded-t-xl object-cover"
                                 src={nft.image}
                              />
                              <div className=" w-full flex gap-2">
                                 <div className=" w-6 h-6">
                                    <img
                                       className=" h-full w-full object-cover rounded-full"
                                       src={"../../images/bannerIMG/avartar.jpg"}
                                    />
                                 </div>
                                 <p>
                                    {String(nft.userId).substring(0, 6)}...
                                    {String(nft.userId).substring(100)}
                                 </p>
                              </div>
                              <p className=" text-gray-500 font-medium">
                                 Highest bidding price:
                              </p>
                              <div
                                 className={` ${
                                    false
                                       ? "flex items-center"
                                       : "flex flex-col items-end"
                                 } w-full gap-3 `}
                              >
                                 <div className=" flex w-full gap-1 items-center">
                                    <div className=" w-5 h-5">
                                       <img src="../../images/icons/cardano.png" />
                                    </div>
                                    <p>{nft.highest_bid}</p>
                                 </div>
                                 <p className=" text-gray-500 font-medium w-full">
                                    Your bidding price:
                                 </p>
                                 <div className="w-full flex flex-col gap-2">
                                    <input
                                       onChange={(e: any) =>
                                          setPrice(Number(e.target.value))
                                       }
                                       className=" text-black w-full rounded-md"
                                       type="number"
                                    />
                                 </div>
                                 <div className="w-full flex flex-col">
                                    <span>Start time: {nft.startAt}</span>
                                    <span>End time: {nft.endAt}</span>
                                 </div>
                                 <button
                                    onClick={() => handleBid(nft)}
                                    className=" w-full p-2 bg-yellow-300 rounded-xl"
                                 >
                                    Bid
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}
               </div>
            )}
         </div>
         {assets.length == 0 && (
            <div className="w-full flex justify-center items-center py-5">
               <span className="text-gray-300 text-xl text-center">No data</span>
            </div>
         )}
         <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
         />
      </div>
   );
}

export default BiddingOnLending;
