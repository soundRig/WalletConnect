'use client'

import React, { useEffect, useState } from "react";
import { Lucid, WalletApi } from "lucid-cardano";
import Spinner from "@/components/ui/Spinner";
import { useStoreActions, useStoreState } from "@/context/store";
import { initLucid, getBalance, getPkh }  from "@/components/lucid/init";

export default function WalletConnect() {
  //Wallet
	const [ishovered, updatehover] = useState(false);
	const [loading, setloading] = useState(true);

  //Lucid
	const [lucid, setLucid] = useState<Lucid | null>(null);
	const [api, setApi] = useState<WalletApi | null>(null);
	const [balance, setBalance] = useState<string>("");

  // WalletStore Init
	const walletStore = useStoreState((state) => state.wallet);
	const setWallet = useStoreActions((actions) => actions.setWallet);
	const availableWallets = useStoreState((state) => state.availableWallets);
	const setAvailableWallets = useStoreActions(
		(actions) => actions.setAvailableWallets
	);
	const pkhStore = useStoreState((state) => state.pkh);
	const setPkh = useStoreActions((actions) => actions.setPkh);
	const userStore = useStoreState((state) => state.user);
	const setUser = useStoreActions((actions) => actions.setUser);
	const setId = useStoreActions((actions) => actions.setId);

	useEffect(() => {
		let wallets = [];
		if (window.cardano) {
			if (window.cardano.nami) wallets.push("Nami");
			if (window.cardano.flint) wallets.push("Flint");
			if (window.cardano.eternl) wallets.push("Eternl");
			if (window.cardano.nufi) wallets.push("Nufi");
		}
		setAvailableWallets(wallets);
		setloading(false);
	}, [lucid, walletStore, balance, api]);

	useEffect(() => {
		loadWalletSession();
	}, []);

	const connectWallet = async (wallet: string) => {
		setloading(true);
    console.log("finding wallet")
		const newapi = await window.cardano[wallet.toLowerCase()].enable();
    console.log("found wallet")
		setApi(newapi);
    console.log("api set")

		if (window.cardano && newapi) {
			if (
				(await newapi.getNetworkId()).toString() !=
				process.env.NEXT_PUBLIC_CARDANOENVNB
			) {
				// createToaster("Error: Wrong Network - Disconnected", "alert");
				const walletStoreObj = { connected: false, name: "", address: "" };
				setloading(false);
				setApi(null);
				return null;
			}
			const newlucid = await initLucid(wallet);
			setLucid(newlucid);
      console.log(newlucid)
			const addr = await newlucid.wallet.address();
			const walletStoreObj = { connected: true, name: wallet, address: addr };
			setWallet(walletStoreObj);
			
			const lvbalance: bigint = (await getBalance(newlucid, addr)) || 0n;
			const fbalance = (lvbalance / 1000000n).toString();
			setBalance(fbalance);

			const pkh = getPkh(newlucid, addr);
			pkh ? setPkh(pkh) : setPkh("");

			const createUser = await fetch(process.env.NEXT_PUBLIC_API + "/users/create", {
				method: "POST",
				body: JSON.stringify({ pkh: pkh }),
				}).then((res) => res.json());
			setUser(createUser);
			setId(createUser._id);
			console.log("Connected: " + createUser._id);
		} else {
			const walletStoreObj = { connected: false, name: "", address: "" };
			setWallet(walletStoreObj);
			setloading(false);
			setApi(null);
		}
	};

	const disconnectWallet = async () => {
		setloading(true);
		if (
			window.cardano &&
			(await window.cardano[walletStore.name.toLowerCase()].enable()) &&
			walletStore.connected
		) {
			const walletStoreObj = { connected: false, name: "", address: "" };
			setBalance("");
			setWallet(walletStoreObj);
		}
	};

	const loadWalletSession = async () => {
		if (
			walletStore.connected &&
			walletStore.name &&
			window.cardano &&
			(await window.cardano[walletStore.name.toLowerCase()].enable())
		) {
			connectWallet(walletStore.name);
		}
	};

  if (loading) {
		return (
				<div className="shadow active:shadow-[inset_-5px_-5px_5px_rgba(253,164,175,99),inset_5px_5px_5px_rgba(244,63,94,96)] bg-gradient-to-br from-orange-400 to-orange-600 hover:bg-gradient-to-tl flex justify-center ">  
					<Spinner />
				</div>
		);
	} if (walletStore.connected) {
		return (
				<div className="relative shadow  active:bg-emerald-400 active:bg-none active:shadow-[inset_-5px_-5px_5px_rgba(110,231,183,91),inset_5px_5px_5px_rgba(16,185,129,73)] bg-gradient-to-br from-orange-400 to-orange-600 hover:bg-gradient-to-tl flex justify-center p-2"
					onMouseEnter={() => updatehover(true)}
					onMouseLeave={() => updatehover(false)}
				>
					<img
						className="mx-1 "
						src={`/wallet-icons/${walletStore.name.toLowerCase()}.svg`}
						height="30"
						width="30"
					></img>
					<p className="mx-2 text-lg"> ₳ {balance} </p>
					{ishovered ? (
						<ul className="absolute w-full top-11  bg-gradient-to-br from-cyan-300 to-cyan-500 hover:bg-gradient-to-tl">
							<li
								className="flex w-full justify-center p-2"
								onClick={() => {
									disconnectWallet();
								}}
							>
								Disconnect
							</li>
						</ul>
					) : null}
				</div>
		);
	} else {
		return (
				<div className="relative shadow active:shadow-[inset_-5px_-5px_5px_rgba(253,164,175,99),inset_5px_5px_5px_rgba(244,63,94,96)] bg-gradient-to-br from-orange-300 to-orange-500 hover:bg-gradient-to-tl flex justify-center p-2"
					onMouseEnter={() => updatehover(true)}
					onMouseLeave={() => updatehover(false)}
				>
				Connect Wallet
				{ishovered ? (
					<ul className="absolute w-full top-11">
						{availableWallets.map((wallet) => (
							<li
								className="flex justify-start w-full z-40 bg-gradient-to-br from-cyan-300 to-cyan-500 hover:bg-gradient-to-tl p-2"
								onClick={() => {
									connectWallet(wallet);
								}}
								key={wallet}
							>
								<a className="flex items-center">
									<img
										className="mx-1 "
										src={`/wallet-icons/${wallet.toLowerCase()}.svg`}
										height="30"
										width="30"
									></img>
									<p className="mx-2"> {wallet} </p>
								</a>
							</li>
						))}
					</ul>
				) : null}
			</div>
		);
	}
}