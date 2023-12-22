<script>
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	import '../app.postcss';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

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

<main class="flex h-full min-h-screen max-w-screen-lg flex-col p-8">
	<slot />
</main>
