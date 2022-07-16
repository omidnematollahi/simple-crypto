<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	import points from './points.js';
	export let history: any;
	let yTicks: any = [];
	yTicks = history.map((item: any) => {
		return item.a;
	});

	const padding = { top: 20, right: 15, bottom: 20, left: 25 };

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
		<path class="path-area" d={area} />
		<path class="path-line" d={path} />
	</svg>
</div>

<style lang="scss">
	.chart,
	h2,
	p {
		width: 100%;
		max-width: 500px;
		margin-left: auto;
		margin-right: auto;
	}

	svg {
		position: relative;
		width: 100%;
		height: 100px;
		overflow: visible;
	}
	.x-axis {
		.tick {
			font-size: 0.725em;
			font-weight: 200;
			&.tick-0 {
				line {
					stroke-dasharray: 0;
				}
			}
			line {
				stroke: #aaa;
				stroke-dasharray: 2;
			}
			text {
				fill: #666;
				text-anchor: start;
			}
		}
	}

	.path-line {
		fill: none;
		stroke: rgb(0, 100, 30);
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2;
	}

	.path-area {
		fill: rgba(0, 100, 33, 0.2);
	}
</style>
