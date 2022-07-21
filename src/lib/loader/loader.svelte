<script lang="ts">
	import { onMount } from 'svelte';

	let loader: any;
	let Component: any;

	onMount(async () => {
		await new Promise((f) => setTimeout(f, 1000)); // simulate delay
		Component = (await loader()).default;
	});

	export { loader as this };
</script>

<svelte:component this={Component} {...$$restProps}>
	<slot />
</svelte:component>

{#if !Component}
	<slot name="fallback" />
{/if}
