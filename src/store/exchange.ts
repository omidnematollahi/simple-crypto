import { writable } from 'svelte/store';
import axios from 'axios';

type ExchangeCurrency = {
	USDALL: number;
	USDEUR: number;
	updateNeeded: boolean;
};
export const exchangeCurrencyState = writable<ExchangeCurrency>({
	USDALL: 0,
	USDEUR: 0,
	updateNeeded: true
});

export const exchange = (to: string, from: string, price: number) => {
	let multi = 0;
	let USDBaseAmount: number;
	if (from == 'USD') {
		USDBaseAmount = price 
	}
	else USDBaseAmount = changeToUSD(from, price);
	
	exchangeCurrencyState.subscribe((value) => {
		if (from == 'EUR' && to == 'ALL') multi = value.USDALL * USDBaseAmount;
		else if (from == 'ALL' && to == 'EUR') multi = value.USDEUR * USDBaseAmount;
		else if (from == 'USD' && to == 'EUR') multi = value.USDEUR * USDBaseAmount;
		else if (from == 'USD' && to == 'ALL') multi = value.USDALL * USDBaseAmount;
	});
	return multi;
};

export const changeToUSD = (from: string, amount: number) => {
	let USDAmount;
	exchangeCurrencyState.subscribe((value) => {
		if (from === 'EUR') {
			USDAmount = amount / value.USDEUR;
		} else USDAmount = amount / value.USDALL;
	});
	return USDAmount;
};

export const changeNoNeedToUpdate = () => {
	exchangeCurrencyState.update((state) => ({ ...state, updateNeeded: false }));
};

export const getCurrnciesPair = async (to: string) => {
	const convertHeader = new Headers();
	convertHeader.append('apikey', '1XI1IlP676SAwLwCgJyu3Sts2lzj3V1M');
	const response = await axios({
		url: 'https://api.exchangerate-api.com/v4/latest/USD',
		method: 'get'
	});

	if (response.status == 200) {
		exchangeCurrencyState.update((state: ExchangeCurrency) => ({
			...state,
			[to == 'ALL' ? 'USDALL' : 'USDEUR']: response.data.rates[to]
		}));
	}
};
