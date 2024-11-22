<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
</script>

<Card.Root class="mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-xl">Sign Up</Card.Title>
		<Card.Description>Enter your information to create an account</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-4">
			<form class="grid gap-4" method="POST">
				<div class="grid gap-2">
					<Label for="name">Name</Label>
					<Input id="name" name="name" placeholder="Sander" required />
				</div>

				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input id="email" name="email" type="email" placeholder="m@example.com" required />
				</div>
				<div class="grid gap-2">
					<Label for="password">Password</Label>
					<Input id="password" name="password" type="password" />
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
