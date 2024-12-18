import { IWallet, Transaction } from '@meshsdk/core';

export const handleSendLovelace = async(wallet: IWallet, address: string, amount: number) => {
    const tx = new Transaction({ initiator: wallet })
      .sendLovelace(
        address,
        (amount * 1000000).toString()
      );
    
    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);
}