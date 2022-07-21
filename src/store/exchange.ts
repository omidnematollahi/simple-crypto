import { writable } from 'svelte/store';
import axios from 'axios';
import type { ExchangeCurrency } from '../types/rates.type';

export const exchangeCurrencyState = writable<ExchangeCurrency>();

export const exchange = (to: keyof ExchangeCurrency, from: keyof ExchangeCurrency, price: number) => {
	let multi = 0;
	let USDBaseAmount: number;
	if (from == 'USD') {
		USDBaseAmount = price;
	} else USDBaseAmount = changeToUSD(from, price)!;

	exchangeCurrencyState.subscribe((value) => {
		multi = Number(value[to]) * USDBaseAmount;
	});
	return multi;
};

export const changeToUSD = (from: keyof ExchangeCurrency, amount: number) => {
	let USDAmount;
	exchangeCurrencyState.subscribe((value) => {
		USDAmount = Number(value[from]) * amount;
	});
	return USDAmount;
};

export const changeNeedToUpdate = (needed: boolean) => {
	exchangeCurrencyState.update((state) => ({ ...state, updateNeeded: needed }));
};

export const getCurrnciesPair = async () => {
	const response = await axios({
		url: 'https://api.exchangerate-api.com/v4/latest/USD',
		method: 'get'
	});

	if (response.status == 200) {
		exchangeCurrencyState.update((state: ExchangeCurrency) => ({
			...state,
			...response.data?.rates
		}));
	}
};
