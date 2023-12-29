<script lang="ts">
	// Forms
	// Components
	import { DraftDisplay, PokedexDisplay, TeamDisplay } from '$lib/components/draft';
	import { Button } from 'flowbite-svelte';
	// Interfaces
	import type { ActionData, PageData } from './$types';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();

	const { supabase } = data;

	// State

	// Form Ref

	// Search Results
	$effect(() => {
		//
	});

	// Subscriptions
	const draftChannel = supabase.channel('draft-channel');

	draftChannel.on(
		'postgres_changes',
		{ event: 'UPDATE', schema: 'public', table: 'drafts' },
		async (payload) => {
			const updatedDraftData = payload.new;

			console.log('cobando ~ file: +page.svelte:29 ~ updatedDraftData:', updatedDraftData);
		}
	);

	draftChannel.subscribe();
</script>

<svelte:head>
	<title>Draft Tool</title>
</svelte:head>

<div class="grid min-h-screen grid-cols-12 gap-5">
	<DraftDisplay />

	<TeamDisplay />

	<PokedexDisplay />

	<div class="bg-primary-500 h-32 w-full"></div>

	<form method="POST" action="/auth/signout">
		<Button type="submit">Sign out</Button>
	</form>
</div>
