"use client";
import React, { useEffect, useState } from "react";
import NFTLending from "./modelUtils/NFTLending";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { getNFTVault, getAddressNFTVault } from "@/script/action/vault/vaultAction";

function LendingNFT() {
   const [isChoose, setChoose] = useState("");
   const [nfts, setNFTs] = useState<any[]>([]);
   const [loading, isLoading] = useState(false);
   const [listAddressID, setAddressID] = useState<any[]>([]);
   const dispatch = useDispatch();
   const marketNFT = useSelector((state: any) => state.vaultReducer.NFTs);

   const changeNFT = (type: string) => {
      isLoading(true);
      if (type == "All") {
         setNFTs(marketNFT);
      } else {
         setNFTs(marketNFT.filter((item: any) => item.type == type));
      }
      setChoose(type);
      isLoading(false);
   };

   const fetchNFTs = () => {
      axios({
         url: process.env.NEXT_PUBLIC_VAULT_NFT_LIST,
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
         },
      })
         .then((res: any) => {
            console.log(res.data.result);
            const nft = new Array();
            res.data.result.forEach(async (event: any) => {
               const tx = await axios.get(event.nft.metadata_uri).then((e) => {
                  const dataNFT = {
                     addressID: event.nft_address,
                     name: e.data.name,
                     type: e.data.attributes[0].type,
                     description: e.data.description,
                     img: e.data.image,
                     owner: event.nft.owner,
                     supply: e.data.attributes[0].supply,
                     lender: event.seller_address,
                     price: event.price,
                     list_state: event.list_state,
                  };
                  nft.push(dataNFT);
                  listAddressID.push(event.nft_address);
               });
            });
            dispatch(getNFTVault(nft));
            dispatch(getAddressNFTVault(listAddressID));
            setNFTs(nft);
         })

         .catch((err: any) => {
            console.warn(err);
         });
   };

   useEffect(() => {
      fetchNFTs();
   }, []);

   const titleList = ["All", "Art", "Abstract", "Gorilla", "Monkey", "Comic", "Video"];

   return (
      <div
         id="Lending NFT"
         className="w-full min-h-[80vh] px-10 py-5 border-x-4 border-[#F7F7F9] z-30 flex flex-col gap-10 justify-center items-center text-white"
      >
         <p className=" text-3xl font-bold">Lending&Borrowing NFT</p>
         <div className="justify-start flex w-full">
            <div className="flex gap-5 w-full">
               {titleList.map((item, index) => (
                  <FilterType
                     key={index}
                     onClick={() => changeNFT(item)}
                     className={` ${isChoose == "All" ? " bg-[#825CE8] text-white " : "border-[#825CE8] text-[#825CE8] "}`}
                  >
                     {item}
                  </FilterType>
               ))}
            </div>
         </div>
         <div className=" w-full flex flex-wrap gap-[50px] justify-center items-center">
            {loading == true && nfts !== undefined ? (
               <CircularProgress color="success" />
            ) : (
               <>
                  {nfts.length > 0 ? nfts.map((e: any, index: number) => (
                     <NFTLending key={index} nfts={e} isList={true} />
                  )): <span className="text-gray-300 text-xl">No data</span>}
               </>
            )}
         </div>
      </div>
   );
}

export default LendingNFT;

const FilterType = styled.div`
   padding: 0.5rem;
   border-width: 2px;
   border-color: #aaa1b6;
   border-radius: 0.75rem;
   cursor: pointer;
`;
