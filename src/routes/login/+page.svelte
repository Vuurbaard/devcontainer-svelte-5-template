<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
</script>

<div class="login">
	<form>
		<h1>Login</h1>
		<Checkbox /> Remember me
		<Button type="submit">HELP</Button>
	</form>
</div>

<style lang="scss">
	.login {
		// display: flex;
		// flex: 1;
		flex-direction: column;
	}
</style>
