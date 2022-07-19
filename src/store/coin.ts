import { writable } from 'svelte/store';
import { exchangeCurrencyState } from './exchange';
import type { State } from '../types/state.type';

export const state = writable<State>({
	BTCItems: [],
	BTCHistory: [],
	ADAItems: [],
	ADAHistory: [],
	ETHItems: [],
	ETHHistory: []
});

export const connect = (socketUrl: string, symbol: string) => {
	const ws = new WebSocket(socketUrl);
	if (!ws) {
		state.update((s: State) => {
			return { ...s, error: 'Unable to connect' };
		});
		return;
	}

	ws.addEventListener('open', () => {
		console.log('connection is opened');
	});

	ws.addEventListener('message', (message: any) => {
		const data: Item = JSON.parse(message.data);

		exchangeCurrencyState.subscribe((value) => {
			if (value.updateNeeded) {
				state.update((state) => ({
					...state,
					BTCHistory: data.s === 'BTCUSDT' ? [data].concat(state.BTCHistory) : state.BTCHistory,
					BTCItems: data.s === 'BTCUSDT' ? [data] : state.BTCItems,
					ETHHistory: data.s === 'ETHUSDT' ? [data].concat(state.ETHHistory) : state.ETHHistory,
					ETHItems: data.s === 'ETHUSDT' ? [data] : state.ETHItems,
					ADAHistory: data.s === 'ADAUSDT' ? [data].concat(state.ADAHistory) : state.ADAHistory,
					ADAItems: data.s === 'ADAUSDT' ? [data] : state.ADAItems,
				}));
			}
		});
	});

	ws.addEventListener('close', (_message: any) => {
		console.log(_message);
	});
};
