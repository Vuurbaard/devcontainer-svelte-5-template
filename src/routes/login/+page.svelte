<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Icons } from '$lib/components/icons';
	// import { Github, Google } from 'lucide-svelte';
</script>

<div class="login flex flex-col items-center">
	<form class="flex flex-col pt-10">
		<h1>Sign in</h1>
		<Input placeholder="Username">Username</Input>
		<Input placeholder="Password">Password</Input>
		<div class="remember align-center flex items-center">
			<Checkbox />
			<span class="px-2 text-sm">Remember me</span>
		</div>
		<Button type="submit">Login</Button>
		<div class="relative my-8 w-full">
			<div class="absolute inset-0 flex items-center">
				<span class="w-full border-t border-gray-300"></span>
			</div>
			<div class="relative flex justify-center text-xs uppercase">
				<span class="bg-background px-2 text-muted-foreground"> Or continue with </span>
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

			.remember {
				padding: 10px 0;
			}
		}
	}
</style>
