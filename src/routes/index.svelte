<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { print } from 'graphql';
	import gql from 'graphql-tag';
	import { state, connect } from '../store/coin';
	import {
		getCurrnciesPair,
		exchange,
		changeNoNeedToUpdate
	} from '../store/exchange';
	import Select from '$lib/select/select.svelte';
	import Card from '$lib/card/card.svelte';
	import Chart from '$lib/chart/chart.svelte';
	import type { CountryType } from '../types/country.type';

	let coins: any[] = [];
	let BTCHistory: any[] = [];
	let ETHHistory: any[] = [];
	let ADAHistory: any[] = [];
	let countrySelected: CountryType;
	let countries: Array<CountryType>;
	let currentCurrency: string = 'USD';

	const convert = () => {
		state.update((currentValue) => {
			Object.keys(currentValue).forEach((coin) => {
				if (coin == 'BTCItems' || coin == 'ETHItems' || coin == 'ADAItems') {
					currentValue[coin][0].a = exchange(
						countrySelected.currencies.edges[0].node.code,
						currentCurrency,
						currentValue[coin][0].a
					);
				}
			});
			return currentValue;
		});
		currentCurrency = countrySelected.currencies.edges[0].node.code;
	};

	const countryChanged = (event: any) => {
		countrySelected = event.detail.country;

		convert();
		changeNoNeedToUpdate();
	};

	onMount(async () => {
		connect('wss://stream.binance.com:9443/ws/btcusdt@ticker', 'BTC');
		connect('wss://stream.binance.com:9443/ws/ethusdt@ticker', 'ETH');
		connect('wss://stream.binance.com:9443/ws/adausdt@ticker', 'ADA');

		state.subscribe((value) => {
			coins = value.BTCItems.concat(value.ADAItems, value.ETHItems);

			BTCHistory = value.BTCHistory;
			ETHHistory = value.ETHHistory;
			ADAHistory = value.ADAHistory;
		});

		getCurrnciesPair('ALL');
		getCurrnciesPair('EUR');

		const GET_COUNTRIES = gql`
			{
				countries(region: "Europe", name_Istartswith: "A") {
					edges {
						node {
							name
							nativeName
							currencies {
								edges {
									node {
										name
										code
										symbol
									}
								}
							}
							flag
						}
					}
				}
			}
		`;
		axios({
			url: 'https://graphql.country/graphql',
			method: 'post',
			data: {
				query: print(GET_COUNTRIES)
			}
		}).then((result) => {
			countries = result.data.data.countries.edges.map((item: any) => {
				return item.node;
			});
		});
	});
</script>

<svelte:head>
	<title>Crypto</title>
	<meta name="description" content="Crypto currency" />
</svelte:head>

<section class="bg-white shadow-lg p-5 m-5 rounded-md main">
	<Select {countries} on:countryChanged={countryChanged} />
	<div class="flex justify-center items-center md:flex-row sm:flex-col">
		{#each coins as coin}
			<div class="grow m-2 sm:min-w-full md:min-w-fit" style="min-height: 280px;">
				<Card {coin}>
					{#if coin.s.includes('BTC')}
						<Chart history={BTCHistory} />
					{/if}
					{#if coin.s.includes('ETH')}
						<Chart history={ETHHistory} />
					{/if}
					{#if coin.s.includes('ADA')}
						<Chart history={ADAHistory} />
					{/if}
				</Card>
			</div>
		{/each}
	</div>
</section>

<style lang="scss">
	.main {
		padding: 100px 150px;
	}
</style>
