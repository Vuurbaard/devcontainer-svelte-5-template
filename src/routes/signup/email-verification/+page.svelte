<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
	import { Icons } from '$lib/components/icons';

	import type { ActionData } from './$types';
	import { Input } from '$lib/components/ui/input';

	let code = '05647759';

	export let form: ActionData;
</script>

<form method="post" use:enhance>
	<h1>Verify</h1>
	{#if form?.message}
		<Alert.Root variant="destructive">
			<Icons.cicleAlert class="h-4 w-4" />
			<Alert.Title>Error</Alert.Title>
			<Alert.Description>{form.message}.</Alert.Description>
		</Alert.Root>
	{/if}

	<br />
	<Input name="code" id="code" bind:value={code} placeholder="Code">Code</Input>
	{#if form?.errors?.code}
		<span class="error">{form?.errors?.code}</span>
	{/if}

	<br />
	<Button type="submit">Verify e-mail</Button>
</form>
