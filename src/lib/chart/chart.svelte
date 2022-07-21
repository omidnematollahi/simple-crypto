<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	export let history: any;
	$: yTicks = history
		.map((item: any) => {
			return item.a;
		})
		.sort((a: number, b: number) => a - b);

	const padding = { top: 20, right: 15, bottom: 20, left: 15 };

	let width = 500;
	let height = 100;

	$: xScale = scaleLinear()
		.domain([minX, maxX])
		.range([padding.left, width - padding.right]);

	$: yScale = scaleLinear()
		.domain([Math.min.apply(null, yTicks), Math.max.apply(null, yTicks)])
		.range([height - padding.bottom, padding.top]);

	$: minX = history[0].C;
	$: maxX = history[history.length - 1].C;
	$: path = `M${history.map((p) => `${xScale(p.C)},${yScale(p.a)}`).join('L')}`;
	$: area = `${path}L${xScale(maxX)},${yScale(0)}L${xScale(minX)},${yScale(0)}Z`;
</script>

<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
	<svg viewBox="0 0 380 100">
		<!-- data -->
		<path
			class="path-area"
			d={area}
			fill={Number(history[history.length - 1].P) > 0
				? 'rgba(0, 100, 33, 0.2)'
				: 'rgb(255, 87, 51, 0.2)'}
		/>
		<path
			class="path-line"
			d={path}
			stroke={Number(history[history.length - 1].P) > 0 ? 'rgb(0, 100, 30)' : 'rgb(255, 87, 51)'}
		/>
	</svg>
</div>

<style lang="scss">
	.chart {
		width: 100%;
		max-width: 380px;
		max-height: 100px;
		margin-left: auto;
		margin-right: auto;
	}

	svg {
		position: relative;
		width: 100%;
		height: 100px;
		overflow: hidden;
	}

	.path-line {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2;
	}
</style>
