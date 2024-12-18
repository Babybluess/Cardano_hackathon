import { useWallet } from "@meshsdk/react";
import {
   createContext,
   ReactNode,
   useContext,
   useEffect,
   useMemo,
   useState,
} from "react";

interface Wallet {
   address: string;
   balance: number;
   assets: any;
}

const initialWallet: Wallet = {
   address: "",
   balance: 0,
   assets: [],
};
const WalletProvider = createContext<Wallet>(initialWallet);

export function BlockchainProvider({ children }: { children: ReactNode }) {
   const [address, setAddress] = useState<string>("");
   const [balance, setBalance] = useState<any>();
   const [assets, setAssets] = useState<any>();
   const { connected, connect, wallet } = useWallet();

   // useEffect(() => {
   //    if (!connected) {
   //       async () => {
   //          connect("lace");
   //          const address = await wallet.getUsedAddresses();
   //          const balance = await wallet.getBalance();
   //          const assets = await wallet.getAssets();

   //          setAddress(address[0]);
   //          setBalance(balance);
   //          setAssets(assets);
   //       };
   //    }
   // }, [connected]);

   return (
      <WalletProvider.Provider value={{ address, balance, assets }}>
         {children}
      </WalletProvider.Provider>
   );
}

export const useMyContext = () => {
   const context = useContext(WalletProvider);
   if (!context) {
      throw new Error("useMyContext must be used within a MyProvider");
   }
   return context;
};
