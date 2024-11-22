<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';

	let { children } = $props();

	import CircleUser from 'lucide-svelte/icons/circle-user';
	import Menu from 'lucide-svelte/icons/menu';
	import Flame from 'lucide-svelte/icons/flame';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
</script>

<div class="flex min-h-screen w-full flex-col">
	<header class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
		<nav
			class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
		>
			<a href="##" class="flex items-center gap-2 text-lg font-semibold md:text-base">
				<Flame class="h-6 w-6" />
				<span class="sr-only">Acme Inc</span>
			</a>
			<a href="##" class="text-foreground transition-colors hover:text-foreground"> Dashboard </a>
			<a href="##" class="text-muted-foreground transition-colors hover:text-foreground">
				Orders
			</a>
			<a href="##" class="text-muted-foreground transition-colors hover:text-foreground">
				Products
			</a>
			<a href="##" class="text-muted-foreground transition-colors hover:text-foreground">
				Customers
			</a>
			<a href="##" class="text-muted-foreground transition-colors hover:text-foreground"> Admin </a>
		</nav>
		<Sheet.Root>
			<Sheet.Trigger>
				<Button variant="outline" size="icon" class="shrink-0 md:hidden">
					<Menu class="h-5 w-5" />
					<span class="sr-only">Toggle navigation menu</span>
				</Button>
			</Sheet.Trigger>
			<Sheet.Content side="left">
				<nav class="grid gap-6 text-lg font-medium">
					<a href="##" class="flex items-center gap-2 text-lg font-semibold">
						<Flame class="h-6 w-6" />
						<span class="sr-only">Acme Inc</span>
					</a>
					<a href="##" class="hover:text-foreground"> Dashboard </a>
					<a href="##" class="text-muted-foreground hover:text-foreground"> Orders </a>
					<a href="##" class="text-muted-foreground hover:text-foreground"> Products </a>
					<a href="##" class="text-muted-foreground hover:text-foreground"> Customers </a>
					<a href="##" class="text-muted-foreground hover:text-foreground"> Admin </a>
				</nav>
			</Sheet.Content>
		</Sheet.Root>
		<div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
			<form class="ml-auto flex-1 sm:flex-initial">
				<div class="relative">
					<!-- <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search products..."
						class="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
					/> -->
				</div>
			</form>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button variant="secondary" size="icon" class="rounded-full">
						<CircleUser class="h-5 w-5" />
						<span class="sr-only">Toggle user menu</span>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>Settings</DropdownMenu.Item>
					<DropdownMenu.Item>Support</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>Logout</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</header>
	<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
		{@render children()}
	</main>
</div>

<!-- <div class="app hidden h-full flex-col md:flex">
	<div
		class="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16"
	>
		<h2 class="text-lg font-semibold">Starter Template</h2>
	</div>
	<div class="h-[1px] w-full shrink-0 bg-border"></div>
	<div class="flex-1">{@render children()}</div>
</div> -->

<!-- <div class="app">
	<Header />

	<main>
		{@render children()}
	</main>

	<footer>
		<p>
			visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to learn about SvelteKit
		</p>
	</footer>
</div> -->

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
