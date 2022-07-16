import { writable } from 'svelte/store';
import { exchangeCurrencyState } from './exchange';

type Item = {
	e: string;
	E: number;
	s: string;
	t: number;
	p: string;
	q: string;
	a: number;
};

type State = {
	BTCItems: Array<Item>;
	BTCHistory: Array<Item>;
	ADAItems: Array<Item>;
	ADAHistory: Array<Item>;
	ETHItems: Array<Item>;
	ETHHistory: Array<Item>;
	error?: string;
};

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
		
		exchangeCurrencyState.subscribe((value) =>{
			if (value.updateNeeded) {
				if (symbol == 'BTC') state.update((state) => ({ ...state, BTCHistory: [data].concat(state.BTCHistory), BTCItems: [data] }));
				else if (symbol == 'ETH') state.update((state) => ({ ...state, ETHHistory: [data].concat(state.ETHHistory), ETHItems: [data] }));
				else if (symbol == 'ADA') state.update((state) => ({ ...state, ADAHistory: [data].concat(state.ADAHistory), ADAItems: [data] }));
			}
		})
		
	});

	ws.addEventListener('close', (_message: any) => {
		console.log(_message);
		
	});
};
