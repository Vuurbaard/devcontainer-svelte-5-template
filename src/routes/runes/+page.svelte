<script lang="ts">
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

<button onclick={() => numbers.push(numbers.length + 1)}> push </button>

<button onclick={() => numbers.pop()}> pop </button>

<svelte:head>
	<title>Runes</title>
	<meta name="description" content="Runes" />
</svelte:head>

<p>
	{numbers.join(' + ') || 0}
	=
	{sum}
</p>

<p>Count: {count}</p>

<input type="number" bind:value={milliseconds} step="500" />
