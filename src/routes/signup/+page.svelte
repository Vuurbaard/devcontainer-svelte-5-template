<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';

	let email = 'sanderbrokelman@msn.com';
	let name = 'Sander';
	let username = 'Vuurbaard';
	let password = '123456';
</script>

<h1>Sign up</h1>
<form method="post" use:enhance>
	<label for="email">E-mail</label>
	<input name="email" id="email" bind:value={email} /><br />

	<label for="name">Name</label>
	<input name="name" id="name" bind:value={name} /><br />

	<label for="username">Username</label>
	<input name="username" id="username" bind:value={username} /><br />

	<label for="password">Password</label>
	<input type="password" name="password" id="password" bind:value={password} /><br />

	<Button type="submit">Continue</Button>
</form>
