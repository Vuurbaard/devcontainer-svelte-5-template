<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let { data, form } = $props();
	let { t } = data;
</script>

<Card.Root class="mx-auto w-full min-w-[50%] sm:max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">{t['login'] ?? 'Login'}</Card.Title>
		<Card.Description>{t['welcome'] ?? 'Enter your email below to login to your account'}</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-4">
			{#if form?.success}
				<div class="text-sm text-green-500">{form?.message}</div>
			{:else if form?.error}
				<div class="text-sm text-red-500">{form?.error}</div>
			{/if}

			<form class="grid gap-4" method="POST" use:enhance>
				<div class="grid gap-2">
					<Label for="email">{t['email'] ?? 'Email'}</Label>
					<Input
						id="email"
						type="email"
						name="username"
						value="admin@vuurbaard.dev"
						class={form?.validationErrors?.username ? 'border-red-500' : ''} />
					{#if form?.validationErrors?.username}
						<div class="text-sm text-red-500">{form.validationErrors.username}</div>
					{/if}
				</div>
				<div class="grid gap-2">
					<div class="flex items-center">
						<Label for="password">{t['password'] ?? 'Password'}</Label>
						<a href="forgot-password" class="ml-auto inline-block text-sm underline">
							{t['forgot-password'] ?? 'Forgot your password?'}
						</a>
					</div>
					<Input
						id="password"
						type="password"
						name="password"
						required
						value="adm"
						class={form?.validationErrors?.password ? 'border-red-500' : ''} />
					{#if form?.validationErrors?.password}
						<div class="text-sm text-red-500">{form.validationErrors.password}</div>
					{/if}
				</div>
				<Button type="submit" class="w-full">{t['login'] ?? 'Login'}</Button>
			</form>

			<div class="relative my-3">
				<div class="absolute inset-0 flex items-center">
					<span class="w-full border-t"></span>
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-background px-2 text-muted-foreground">{t['or-continue-with'] ?? 'Or continue with'}</span>
				</div>
			</div>
			<Button variant="outline" class="w-full">{t['login-with-google'] ?? 'Login with Google'}</Button>
			<Button variant="outline" class="w-full">{t['login-with-github'] ?? 'Login with GitHub'}</Button>
		</div>
		<div class="mt-4 text-center text-sm">
			{t['no-account-yet'] ?? "Don't have an account yet?"}
			<a href="/register" class="underline">{t['sign-up'] ?? 'Sign up'}</a>
		</div>
	</Card.Content>
</Card.Root>
