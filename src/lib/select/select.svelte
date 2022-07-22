<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { CountryType } from '../../types/country.type';
	import { createEventDispatcher } from 'svelte';

	export let countries: any[];

	const dispatch = createEventDispatcher();

	export let selected: CountryType = {
		name: 'United States of America',
		flag: 'https://storage.googleapis.com/graphql-country.appspot.com/flags/usa.svg',
		nativeName: 'United States',
		currencies: { edges: [{ node: { code: 'USD', name: 'United States dollar', symbol: '$' } }] }
	};

	let show: boolean = false; // menu state
	let menu: any = null; // menu wrapper DOM reference

	function selectCountry(country: CountryType) {
		dispatch('countryChanged', {
			country: country
		});
		show = !show;
		selected = country;
	}
	onMount(() => {
		const handleOutsideClick = (event: any) => {
			if (show && !menu.contains(event.target)) {
				show = false;
			}
		};

		const handleEscape = (event: any) => {
			if (show && event.key === 'Escape') {
				show = false;
			}
		};

		// add events when element is added to the DOM
		document.addEventListener('click', handleOutsideClick, false);
		document.addEventListener('keyup', handleEscape, false);

		// remove events when element is removed from the DOM
		return () => {
			document.removeEventListener('click', handleOutsideClick, false);
			document.removeEventListener('keyup', handleEscape, false);
		};
	});
</script>

<div class="menu" bind:this={menu}>
	<label id="listbox-label" class="block text-sm font-medium text-gray-700">
		Select your country
	</label>
	<div class="mt-1 relative">
		<button
			on:click={() => (show = !show)}
			type="button"
			class="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
			aria-haspopup="listbox"
			aria-expanded="true"
			aria-labelledby="listbox-label"
		>
			<span class="flex items-center">
				<img src={selected.flag ?? ''} alt="" class="flex-shrink-0 h-6 w-6 rounded-full" />
				<span class="ml-3 block truncate"> {selected.name} </span>
			</span>
			<span class="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
				<!-- Heroicon name: solid/selector -->
				<svg
					class="h-5 w-5 text-gray-400"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</span>
		</button>

		{#if show}
			<ul
				class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
				tabindex="-1"
				role="listbox"
				aria-labelledby="listbox-label"
				aria-activedescendant="listbox-option-3"
				transition:fade
			>
				{#each countries as country}
					<li
						class="text-gray-900 cursor-poniter select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white menu__item"
						id="listbox-option-0"
						role="option"
						on:click={selectCountry(country)}
					>
						<div class="flex items-center">
							<img
								src={country.flag}
								alt={country.name}
								class="flex-shrink-0 h-6 w-6 rounded-full"
							/>
							<!-- Selected: "font-semibold", Not Selected: "font-normal" -->
							<span class="font-normal ml-3 block truncate"> {country.name} </span>
						</div>
						{#if selected.nativeName == country.nativeName}
							<span
								class="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4 hover:text-white menu__active-icon"
							>
								<svg
									class="h-5 w-5"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
							</span>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style lang="scss">
	.menu {
		display: flex;
		flex-direction: column;
		width: 50%;
		margin: 10px auto;
		&__item {
			&:hover {
				.menu__active-icon {
					color: white;
				}
			}
		}
	}
</style>
