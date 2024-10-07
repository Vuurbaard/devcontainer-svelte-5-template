<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Icons } from '$lib/components/icons';
	import * as Alert from '$lib/components/ui/alert';
	import type { ActionData } from './$types';

	let username = 'Vuurbaard';
	let password = '';

	export let form: ActionData;
</script>

<div class="login flex flex-col items-center">
	<form class="flex flex-col pt-10" method="post" use:enhance>
		<h1>Sign in</h1>
		{#if form?.message}
			<Alert.Root variant="destructive">
				<Icons.cicleAlert class="h-4 w-4" />
				<Alert.Title>Error</Alert.Title>
				<Alert.Description>{form.message}.</Alert.Description>
			</Alert.Root>
		{/if}

		<div>
			<Input
				placeholder="Username"
				name="username"
				bind:value={username}
				class={form?.errors?.username ? 'border-red-500' : ''}>Username</Input
			>
			{#if form?.errors?.username}
				<span class="mt-2 text-sm text-red-500 antialiased">{form?.errors?.username}</span>
			{/if}
		</div>

		<div>
			<Input
				placeholder="Password"
				name="password"
				type="password"
				bind:value={password}
				class={form?.errors?.password ? 'border-red-500' : ''}
			>
				Password
			</Input>
			{#if form?.errors?.password}
				<span class="mt-2 text-sm text-red-500 antialiased">{form?.errors?.password}</span>
			{/if}
		</div>

		<Button type="submit">Login</Button>
		<p class="px-8 py-4 text-center text-sm text-muted-foreground">
			Don't have an account?
			<a href="/signup" class="underline underline-offset-4 hover:text-primary">Sign up</a>
		</p>
		<div class="relative my-8 w-full">
			<div class="absolute inset-0 flex items-center">
				<span class="w-full border-t border-gray-300"></span>
			</div>
			<div class="relative flex justify-center text-xs uppercase">
				<span class="bg-background px-2 text-muted-foreground">Or continue with</span>
			</div>
		</div>
		<Button href="/login/github" variant="outline">
			<Icons.github class="mr-2 h-6 w-6" />
			Sign in with GitHub
		</Button>
		<Button href="/login/google" variant="outline">
			<Icons.google class="mr-2 h-4 w-4" />
			Sign in with Google
		</Button>
		<Button href="/login/discord" variant="outline">
			<Icons.discord class="mr-2 h-5 w-5" />
			Sign in with Discord
		</Button>
		<p class="px-8 py-4 text-center text-sm text-muted-foreground">
			By clicking continue, you agree to our
			<a href="/terms" class="underline underline-offset-4 hover:text-primary">Terms of Service</a>
			and
			<a href="/privacy" class="underline underline-offset-4 hover:text-primary">Privacy Policy</a>
			.
		</p>
	</form>
</div>

<style lang="scss">
	.login {
		form {
			gap: 10px;
			width: 50dvw;
		}
	}
</style>
