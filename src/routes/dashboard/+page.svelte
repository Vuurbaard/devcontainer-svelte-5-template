<script lang="ts">
	let { data } = $props();
	let { t } = data;
</script>

<h1>{t['dashboard.welcome'] ?? 'Welcome, {{name}}'}</h1>
