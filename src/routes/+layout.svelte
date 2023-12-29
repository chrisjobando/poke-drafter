<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	// Styling
	import '../app.postcss';

	const { data } = $props();

	let { supabase, session } = data;

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((_event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<slot />
