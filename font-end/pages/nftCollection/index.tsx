"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { UpdatedIMG } from "@/components";
import { useWallet } from "@meshsdk/react";
import { mintNFT } from "@/role/AuctionStage/createAuctionStage";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { assetService, auctionService, userService } from "@/service";
import { TAsset } from "@/types/user.type";
import NFTModel from "./NFTModel";
import { listAsset } from "@/role/AuctionStage/listAsset";
import { claimAsset } from "@/role/AuctionStage/claimAsset";

function index() {
   const router = useRouter();
   const [loading, isLoading] = useState(true);
   const [addressWallet, setAddress] = useState<string>("");
   const [balance, setBalance] = useState<number>(0);
   const [assets, setAssets] = useState<TAsset[]>();
   const [claimAssets, setClaimAssets] = useState<TAsset[]>([]);
   const { connected, wallet } = useWallet();
   const [price, setPrice] = useState(0);

   const startAuction = async (asset: TAsset) => {
      if (price == 0) {
         alert("Please set price for nft");
      } else {
         const list = await listAsset(wallet, asset, price);
         setTimeout(() => {
            toast.success("🦄 It is successfull sold nft!", {
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

   const handleClaim = async (asset: TAsset) => {
      const tx = await claimAsset(wallet, asset);
      setTimeout(() => {
         toast.success("🦄 It is successfull claim nft!", {
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
   };

   const backClick = () => {
      router.back();
   };

   useEffect(() => {
      const data = async () => {
         const address = await wallet.getUsedAddresses();
         const balance = await wallet.getBalance();
         const assetLists = await assetService.getAllOwnAsset(address[0]);
         const claimAssets = assetLists.filter(
            (item: TAsset) => item.highest_bid > 0,
         );


         console.log("check", assetLists, claimAssets)
         setAddress(address[0]);
         setBalance(Number(balance[0].quantity) / 1000000);
         setAssets(assetLists);
         setClaimAssets(claimAssets);

         console.log(assetLists);
      };

      data();
   }, []);

   const handleCreateStage = async () => {
      if (!connected) {
         alert("Please connect wallet!");
      } else {
         const user = await userService.getProfileByName(addressWallet);
         if (user.market == null) {
            mintNFT("Auction Stage", wallet, connected);

            const asset = await wallet.getAssets();
            const updatedUser = await userService.updateProfile(user.id, {
               marketId: "Certification",
            });

            setTimeout(() => {
               toast.success("🦄 It is successfull auction market registeration NFT!", {
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
         } else {
            alert("You are already auctioneer");
         }
      }
   };

   //    if (address && address.length > 0) {
   //       return (
   //          <div className="w-full flex flex-wrap px-20 gap-10 justify-center items-center">
   //             {assets !== undefined &&
   //                assets.length > 0 &&
   //                assets.map((e: any, index: number) => (
   //                   <NFTModel key={index} nft={e} isSell={true} />
   //                ))}
   //          </div>
   //       );
   //    } else {
   //       return (
   //          <div className="w-full flex justify-center items-center">
   //             <span className="text-xl text-gray-400">No data</span>
   //          </div>
   //       );
   //    }
   // }, [address]);

   return (
      <div className=" w-full min-h-screen relative flex flex-col bg-white">
         <p
            onClick={() => backClick()}
            className=" absolute left-5 top-5 hover:-translate-x-2 cursor-pointer w-[40px] h-[40px] bg-[#E2EAB0] rounded-xl flex justify-center items-center"
         >
            &#8592;
         </p>
         <div className=" w-full h-[500px] bg-white">
            <UpdatedIMG name={"Background"} />
            <div className=" flex w-full h-[250px] max-sm:pt-10 gap-2 items-end px-[10%] -translate-y-40">
               <UpdatedIMG name={"Avatar"} />
               <div className=" h-[50px] flex justify-center items-center rounded-xl bg-gradient-to-br from-[#E55D87] to-[#5FC3E4]">
                  <span className=" text-black font-bold text-3xl max-sm:text-sm px-[10px] flex items-end">
                     {addressWallet.substring(0, 6)}...{addressWallet.substring(100)}
                  </span>
               </div>
               <span>{balance.toFixed(2)} ADA</span>
            </div>
         </div>
         <div className="w-full px-[5%] py-[5%] flex flex-col gap-10 justify-center items-center bg-white">
            <div className=" text-black font-semibold w-[100%] justify-between flex items-center">
               <span className="text-3xl">My Collection</span>
               <button
                  onClick={handleCreateStage}
                  className="p-2 rounded-xl bg-green-400"
               >
                  Create Auction Stage
               </button>
            </div>
         </div>
         {/* Own Assets */}
         <div className="w-full h-full px-5">
            <span>Own assets</span>
            {addressWallet.length > 0 ? (
               <div className="w-full flex flex-wrap p-20 gap-10">
                  {assets &&
                     assets.map((nft: TAsset, index: number) => (
                        <div
                           key={index}
                           className={`w-[300px] h-[450px] shadow-inner shadow-indigo-500 flex flex-col justify-center items-center border-2 border-[#5B3BA8] rounded-md bg-[#28262F] relative ${nft.highest_bid > 0 ? "hidden" : "visible"}`}
                        >
                           <div className=" w-[30%] text-center absolute left-0 top-0 z-40 text-white font-medium rounded-br-xl bg-[#5C3CA8]">
                              <p>{nft.type}</p>
                           </div>
                           <div
                              className={
                                 "w-full h-[65vh] px-5 py-2  flex flex-col text-white rounded-t-xl"
                              }
                           >
                              <div className=" w-full h-[65%] rounded-t-xl flex justify-center items-center">
                                 {nft.type == "Video" ? (
                                    <video
                                       className=" rounded-t-xl h-full w-full object-fill"
                                       autoPlay={true}
                                       loop
                                       controls={false}
                                       muted
                                    >
                                       <source
                                          src={nft.image}
                                          className=" w-full h-full"
                                          type="video/mp4"
                                       />
                                    </video>
                                 ) : (
                                    <img
                                       className=" w-full h-full py-1 rounded-t-xl object-cover"
                                       src={nft.image}
                                    />
                                 )}
                              </div>
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
                                    {true ? (
                                       <input
                                          onChange={(e: any) => setPrice(Number(e.target.value))}
                                          className=" text-black w-full rounded-md"
                                          type="number"
                                       />
                                    ) : (
                                       <p>{nft.highest_bid}</p>
                                    )}
                                 </div>
                                 <div className="w-full flex flex-col gap-2">
                                    <span>Start time: {nft.startAt}</span>
                                    <span>End time: {nft.endAt}</span>
                                 </div>
                                 <button
                                    onClick={() => startAuction(nft)}
                                    className=" w-full p-2 bg-red-500 rounded-xl"
                                 >
                                    Start Auction
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}
               </div>
            ) : (
               <div className="w-full flex justify-center items-center">
                  <span className="text-xl text-gray-400">No data</span>
               </div>
            )}
         </div>

         {/* Claim Assets */}
         <div className="w-full h-full p-5">
            <span>Own claim assets</span>
            {addressWallet.length > 0 ? (
               <div className="w-full flex flex-wrap p-20 gap-10">
                  {claimAssets &&
                     claimAssets.map((nft: TAsset, index: number) => (
                        <div
                           key={index}
                           className={`w-[300px] h-[450px] shadow-inner shadow-indigo-500 flex flex-col justify-center items-center border-2 border-[#5B3BA8] rounded-md bg-[#28262F] relative`}
                        >
                           <div className=" w-[30%] text-center absolute left-0 top-0 z-40 text-white font-medium rounded-br-xl bg-[#5C3CA8]">
                              <p>{nft.type}</p>
                           </div>
                           <div
                              className={
                                 "w-full h-[65vh] px-5 py-2  flex flex-col text-white rounded-t-xl"
                              }
                           >
                              <div className=" w-full h-[65%] rounded-t-xl flex justify-center items-center">
                                 {nft.type == "Video" ? (
                                    <video
                                       className=" rounded-t-xl h-full w-full object-fill"
                                       autoPlay={true}
                                       loop
                                       controls={false}
                                       muted
                                    >
                                       <source
                                          src={nft.image}
                                          className=" w-full h-full"
                                          type="video/mp4"
                                       />
                                    </video>
                                 ) : (
                                    <img
                                       className=" w-full h-full py-1 rounded-t-xl object-cover"
                                       src={nft.image}
                                    />
                                 )}
                              </div>
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
                                 <div className="w-full flex flex-col gap-2">
                                    <span>Start time: {nft.startAt}</span>
                                    <span>End time: {nft.endAt}</span>
                                 </div>
                                 <button
                                    onClick={() => handleClaim(nft)}
                                    className=" w-full p-2 bg-green-400 rounded-xl"
                                 >
                                    Claim
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}
               </div>
            ) : (
               <div className="w-full flex justify-center items-center">
                  <span className="text-xl text-gray-400">No data</span>
               </div>
            )}
         </div>
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

export default index;
