export type CryptoItem = {
	e: string;
	E: number;
	s: string;
	t: number;
	p: string;
	q: string;
};
export type State = {
	BTCItems: Array<CryptoItem>;
	BTCHistory: Array<CryptoItem>;
	ADAItems: Array<CryptoItem>;
	ADAHistory: Array<CryptoItem>;
	ETHItems: Array<CryptoItem>;
	ETHHistory: Array<CryptoItem>;
	error?: string;
};