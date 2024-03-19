import { useStoreState } from '@/context/store'
import { useState, useEffect } from 'react'
import { initLucid } from './init'
import { mintCS, refCS, refAddress, mintRedeemer, mint, rAddress } from './contracts'
import { Constr, Data, Lucid, fromText, toUnit } from 'lucid-cardano';
import { Button } from '@/ui'

export default function BMint({limit, amount, tokenName}: {
	limit: number, amount: number, tokenName: string
}) {
  const walletStore = useStoreState((state) => state.wallet);
	const [lucid, setLucid] = useState<Lucid | null>(null);
	const [TxHash, setTxHash] = useState("None");
	
	useEffect(() => {
		if (!lucid && walletStore.connected) {
			initLucid(walletStore.name).then((Lucid: Lucid) => {
				setLucid(Lucid);
			});
		}
	}, [lucid]);

	const bountyQty = limit 
	const bountyAmount = amount 
	const bountyValue = bountyQty * bountyAmount * 1000000;
	const assetName = fromText(tokenName)
	
	const createTx = async () => {
		try {
			if (!lucid) {
				throw Error("Lucid not instantiated");
			}
			
			const refName = fromText("Raiders")
			const rDatum = Data.to(new Constr(0, [BigInt(bountyQty), BigInt(bountyAmount)]))
			const bounty = BigInt(bountyValue + 2000000)

			const refUtxo = await lucid.utxosAtWithUnit(refAddress, toUnit(refCS, refName))
			const utxos = await lucid.wallet.getUtxos()

			const tx = await lucid
				.newTx()
				.collectFrom(utxos)
				.mintAssets({
					[toUnit(mintCS, assetName)]: BigInt(1),
				}, mintRedeemer)
				.attachMintingPolicy(mint)
				.readFrom(refUtxo)
				.payToContract(rAddress, { inline: rDatum }, { [toUnit(mintCS, assetName)]: BigInt(1), lovelace: bounty })
				.complete()
				
			const signedTx = await tx.sign().complete()

			const txHash = await signedTx.submit()
			
			console.log(txHash);
			setTxHash(txHash);
			return txHash;
		} catch (e: any) {
			console.log(e);
			return e.message
		}
	};

	return (
	<>
		{TxHash !== 'None' ? <p className="text-sm text-wrap break-words">{TxHash}</p> : <Button onClick={createTx}>Sign & Mint</Button>}
	</>
	);
};
// return createTx(), tokenName;
