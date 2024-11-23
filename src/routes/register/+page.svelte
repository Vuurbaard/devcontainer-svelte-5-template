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
		<Card.Title class="text-xl">Sign Up</Card.Title>
		<Card.Description>Enter your information to create an account</Card.Description>
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
					<Label for="username">Username</Label>
					<Input
						id="username"
						name="username"
						placeholder="Vuurbaard"
						required
						class={form?.errors?.username ? 'border-red-500' : ''}
					/>
					{#if form?.errors?.username}
						<div class="text-sm text-red-500">{form.errors.username}</div>
					{/if}
				</div>
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						name="email"
						placeholder="vuurbaard@example.com"
						required
						class={form?.errors?.email ? 'border-red-500' : ''}
					/>
					{#if form?.errors?.email}
						<div class="text-sm text-red-500">{form.errors.email}</div>
					{/if}
				</div>
				<div class="grid gap-2">
					<Label for="password">Password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						required
						class={form?.errors?.password ? 'border-red-500' : ''}
					/>
					{#if form?.errors?.password}
						<div class="text-sm text-red-500">{form.errors.password}</div>
					{/if}
				</div>
				<Button type="submit" class="mt-6 w-full">Create an account</Button>
			</form>
			<div class="relative my-3">
				<div class="absolute inset-0 flex items-center">
					<span class="w-full border-t"></span>
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-background px-2 text-muted-foreground">Or</span>
				</div>
			</div>
			<Button variant="outline" class="w-full">Sign up with Google</Button>
			<Button variant="outline" class="w-full">Sign up with GitHub</Button>
		</div>
		<div class="mt-6 text-center text-sm">
			Already have an account?
			<a href="/login" class="underline"> Sign in </a>
		</div>
	</Card.Content>
</Card.Root>
