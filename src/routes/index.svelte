<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { print } from 'graphql';
	import { GET_COUNTRIES_QUERY } from '../constants/constants';
	import { state, connect } from '../store/coin';
	import { getCurrnciesPair, changeCurrentCurrency } from '../store/exchange';
	import Select from '$lib/select/select.svelte';
	import Card from '$lib/card/card.svelte';
	import Chart from '$lib/chart/chart.svelte';
	import type { CountryType } from '../types/country.type';
	import { Circle2 } from 'svelte-loading-spinners';

	let coins: any[] = [];
	let BTCHistory: any[] = [];
	let ETHHistory: any[] = [];
	let ADAHistory: any[] = [];
	let countrySelected: CountryType;
	let countries: Array<CountryType> = [];

	const countryChanged = (event: any) => {
		countrySelected = event.detail.country;

		changeCurrentCurrency(countrySelected.currencies.edges[0].node.code);
	};

	onMount(async () => {
		connect('wss://stream.binance.com:9443/ws/btcusdt@ticker/ethusdt@ticker/adausdt@ticker', 'BTC');

		state.subscribe((value) => {
			coins = value.BTCItems.concat(value.ADAItems, value.ETHItems);

			BTCHistory = value.BTCHistory;
			ETHHistory = value.ETHHistory;
			ADAHistory = value.ADAHistory;
		});

		getCurrnciesPair();

		axios({
			url: 'https://graphql.country/graphql',
			method: 'post',
			data: {
				query: print(GET_COUNTRIES_QUERY)
			}
		}).then((result) => {
			const data = result.data.data;
			Object.keys(data).forEach((filteredCountry) => {
				data[filteredCountry].edges.forEach((item: any) => {
					countries.push(item.node);
				});
			});
		});
	});
</script>

<svelte:head>
	<title>Crypto</title>
	<meta name="description" content="Crypto currency" />
</svelte:head>

<section class="bg-white shadow-lg p-5 m-5 rounded-md main">
	<Select {countries} on:countryChanged={countryChanged} selected={countries[0]} />
	{#if !coins.length}
		<Circle2 size="80" unit="px" />
	{/if}
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
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
</style>
