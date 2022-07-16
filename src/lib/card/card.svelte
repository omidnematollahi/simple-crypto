<script lang="ts">
	export let coin: any;
</script>

<div class="bg-white shadow-2xl overflow-hidden sm:rounded-lg">
	<div class="flex px-4 py-5 sm:px-6 justify-between">
		<h3 class="text-lg leading-6 font-medium text-gray-900">{coin.s}</h3>
		<span class="{coin.P < 0  ? 'text-red-600' : 'text-green-600'}">{coin.P}</span>
	</div>
	<div class="flex px-4 sm:px-6 justify-between mb-1">
		<p class="mt-1 max-w-2xl font-bold text-lg text-slate-800">{coin.a}</p>
	</div>
	<div class="flex px-4 sm:px-6 justify-between">
		<p class="mt-1 max-w-2xl font-bold text-sm text-slate-800">volume: {coin.v}</p>
	</div>
	<slot/>
</div>
