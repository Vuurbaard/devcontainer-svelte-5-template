<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	let numbers = $state([1, 2, 3]);

	let sum = $derived(numbers.reduce((a: number, b: number) => a + b, 0));

	let count = $state(0);
	let milliseconds = $state(1000);

	$effect(() => {
		// This will be recreated whenever `milliseconds` changes
		const interval = setInterval(() => {
			count += 1;
		}, milliseconds);

		return () => {
			// if a callback is provided, it will run
			// a) immediately before the effect re-runs
			// b) when the component is destroyed
			clearInterval(interval);
		};
	});
</script>

<svelte:head>
	<title>Runes</title>
	<meta name="description" content="Runes" />
</svelte:head>

<div class="flex flex-col items-center">
	<div class="flex flex-col items-center">
		<p>
			{numbers.join(' + ') || 0}
			=
			{sum}
		</p>
		<div>
			<Button onclick={() => numbers.push(numbers.length + 1)}>push</Button>
			<Button onclick={() => numbers.pop()}>pop</Button>
		</div>
	</div>
	<br />
	<br />
	<div class="count">
		<p>Count: {count}</p>
	</div>

	<div class="interval">
		<span>interval:&nbsp;</span>
		<input type="number" bind:value={milliseconds} step="500" />
		<span>ms</span>
	</div>
</div>

<style lang="scss">
</style>
