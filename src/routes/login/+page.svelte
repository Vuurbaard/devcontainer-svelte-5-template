<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<Card.Root class="mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-4">
			{#if form?.success}
				<p>{form.message}</p>
			{/if}
			{#if form?.error}
				<div class="text-sm text-red-500">{form.error}</div>
			{/if}
			<form class="grid gap-4" method="POST" use:enhance>
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						name="username"
						required
						value="admin@vuurbaard.dev"
						class={form?.errors?.username ? 'border-red-500' : ''}
					/>
					{#if form?.errors?.username}
						<div class="text-sm text-red-500">{form.errors.username}</div>
					{/if}
				</div>
				<div class="grid gap-2">
					<div class="flex items-center">
						<Label for="password">Password</Label>
						<a href="##" class="ml-auto inline-block text-sm underline"> Forgot your password? </a>
					</div>
					<Input
						id="password"
						type="password"
						name="password"
						required
						value="adminpassword"
						class={form?.errors?.password ? 'border-red-500' : ''}
					/>
					{#if form?.errors?.password}
						<div class="text-sm text-red-500">{form.errors.password}</div>
					{/if}
				</div>
				<Button type="submit" class="w-full">Login</Button>
			</form>

			<div class="relative my-3">
				<div class="absolute inset-0 flex items-center">
					<span class="w-full border-t"></span>
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-background px-2 text-muted-foreground">Or continue with</span>
				</div>
			</div>
			<Button variant="outline" class="w-full">Login with Google</Button>
			<Button variant="outline" class="w-full">Login with GitHub</Button>
		</div>
		<div class="mt-4 text-center text-sm">
			Don&apos;t have an account?
			<a href="/register" class="underline">Sign up</a>
		</div>
	</Card.Content>
</Card.Root>
