import Button from "@mui/material/Button";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { userService } from "@/service";
import { Modal } from "@mui/material";

export function ConnectWallet() {
   const { connect, connected, wallet } = useWallet();

   const handleNewUser = async () => {
      const address = await wallet.getUsedAddresses();
      const isExistUser = await userService.getProfileByName(address[0]);

      console.log(isExistUser, address);
      if (isExistUser == undefined) {
         const newUser = await userService.createNewUser({
            name: address[0],
            avatar: process.env.NEXT_PUBLIC_AVATAR,
         });
         return newUser;
      } else {
         return isExistUser;
      }
   };

   return (
      <div>
         <Button variant="contained" color="success" onClick={() => connect("lace")}>
            <CardanoWallet
               label={"Connect a Wallet"}
               onConnected={handleNewUser}
               color={"black"}
               metamask={{ network: "preprod" }}
               cardanoPeerConnect={{
                  dAppInfo: {
                     name: "Mesh SDK",
                     url: "https://meshjs.dev/",
                  },
                  announce: [
                     "wss://dev.btt.cf-identity-wallet.metadata.dev.cf-deployments.org",
                  ],
               }}
            />
         </Button>
      </div>
   );
}
