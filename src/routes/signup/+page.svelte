<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import type { ActionData } from './$types';

	let email = 'sanderbrokelman@msn.com';
	let name = 'Sander';
	let username = 'Vuurbaard';
	let password = '123456';

	export let form: ActionData;
</script>

<h1>Sign up</h1>
<form method="post" use:enhance>
	<label for="email">E-mail</label>
	<input name="email" id="email" bind:value={email} /><br />
	{#if form?.errors?.email}
		<span class="error">{form?.errors?.email}</span>
	{/if}

	<label for="name">Name</label>
	<input name="name" id="name" bind:value={name} /><br />
	{#if form?.errors?.name}
		<span class="error">{form?.errors?.name}</span>
	{/if}

	<label for="username">Username</label>
	<input name="username" id="username" bind:value={username} /><br />
	{#if form?.errors?.username}
		<span class="error">{form?.errors?.username}</span>
	{/if}

	<label for="password">Password</label>
	<input type="password" name="password" id="password" bind:value={password} /><br />
	{#if form?.errors?.password}
		<span class="error">{form?.errors?.password}</span>
	{/if}

	<br />
	<Button type="submit">Sign up</Button>
</form>
