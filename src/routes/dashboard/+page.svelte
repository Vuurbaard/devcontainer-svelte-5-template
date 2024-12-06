<script lang="ts">
	let { data } = $props();
	let { t } = data;
</script>

<h1>{t['welcome'] ?? 'Welcome, {{username}}'}</h1>
