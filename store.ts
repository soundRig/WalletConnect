"use client";
import { createTypedHooks } from "easy-peasy";
import { Action, action } from "easy-peasy";
import { createStore, persist } from "easy-peasy";
import { User, IUser } from "@/models/user";

// WalletStore
interface WalletStoreInterface {
	connected: boolean;
	name: string;
	address: string;
}

interface StoreModelInterface {
	wallet: WalletStoreInterface;
	setWallet: Action<StoreModelInterface, WalletStoreInterface>;
	availableWallets: string[];
	setAvailableWallets: Action<StoreModelInterface, string[]>;
	pkh: string;
	setPkh: Action<StoreModelInterface, string>;
	user: IUser;
	setUser: Action<StoreModelInterface, IUser>;
	userId: string;
	setId: Action<StoreModelInterface, string>;
}

const storeModel: StoreModelInterface = {
	wallet: { connected: false, name: "", address: "" },
	setWallet: action((state, newWallet) => {
		state.wallet = newWallet;
	}),
	availableWallets: [],
	setAvailableWallets: action((state, newAvailableWallets) => {
		state.availableWallets = newAvailableWallets;
	}),
	pkh: "",
	setPkh: action((state, newPkh) => {
		state.pkh = newPkh;
	}),
	user: {
		pkh: "",
		isAdmin: false,
		score: 0,
		availableBounties: [],
		completedBounties: [],
		createdBounties: [],
	},
	setUser: action((state, newUser) => {
		state.user = newUser;
	}),
	userId: "",
	setId: action((state, newId) => {
		state.userId = newId;
	}),
};

const store = createStore(persist(storeModel));
export default store;

/* Typed Hooks */
const { useStoreActions, useStoreState, useStoreDispatch, useStore } =
	createTypedHooks<StoreModelInterface>();

export { useStoreActions, useStoreState, useStoreDispatch, useStore };
