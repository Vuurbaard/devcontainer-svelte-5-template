<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
</script>

<div class="login flex flex-col items-center">
	<form class="flex flex-col">
		<h1>Login</h1>
		<Input placeholder="Username">Username</Input>
		<Input placeholder="Password">Password</Input>
		<div class="remember">
			<Checkbox />
			<span>Remember me</span>
		</div>
		<Button type="submit">Login</Button>
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
