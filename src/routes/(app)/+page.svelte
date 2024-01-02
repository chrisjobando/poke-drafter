<script lang="ts">
	// Components
	import { DraftDisplay, PokedexDisplay, TeamDisplay } from '$lib/components/draft';
	import { Button } from 'flowbite-svelte';
	// Stores
	import { createPokemonSelection } from '$lib/components/store/pokemonSelectionStore.svelte';
	// Interfaces
	import type { IDraft, IOtherTrainer, IPokemon } from '$lib/db/schema/DatabaseTypes';
	import type { ActionData, PageData } from './$types';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();

	let {
		supabase,
		trainerData,
		draftData: initialDraftData,
		otherTrainerData: initialOtherTrainerData,
		teamId,
		trainerPokemonData: initialTrainerPokemonData
	} = data;

	// State
	let draftData = $state<IDraft | undefined>(initialDraftData);

	let trainerPokemonData = $state<IPokemon[]>(initialTrainerPokemonData ?? []);
	let otherTrainerData = $state<IOtherTrainer[]>(initialOtherTrainerData ?? []);

	let userActive = $state<boolean>(false);

	const pokemonSelection = createPokemonSelection();

	// Active user check
	$effect(() => {
		if (draftData) {
			userActive = draftData.active_trainer === trainerData.id;
		}
	});

	// Search Results
	$effect(() => {
		if (form) {
			if (form.success) {
				if ('selectedPokemon' in form) {
					pokemonSelection.selectedPokemon = form.selectedPokemon as IPokemon;
				}
			}
		}
	});

	// Subscriptions
	const draftChannel = supabase.channel('draft-channel');

	draftChannel.on(
		'postgres_changes',
		{ event: 'UPDATE', schema: 'public', table: 'drafts' },
		async (payload) => {
			draftData = payload.new as IDraft;
		}
	);

	draftChannel.on(
		'postgres_changes',
		{ event: 'INSERT', schema: 'public', table: 'pokemon' },
		async (payload) => {
			const newPokemon = payload.new as IPokemon;

			if (newPokemon.team_id === teamId) {
				// Update own team
				trainerPokemonData.push(newPokemon);
			} else if (otherTrainerData) {
				// Find and update other team
				for (let i = 0; i < otherTrainerData.length; i++) {
					const trainer = otherTrainerData[i];

					if (trainer.trainerTeamId === newPokemon.team_id) {
						trainer.teamPokemonData.push(newPokemon);
						break;
					}
				}
			}
		}
	);

	draftChannel.subscribe();
</script>

<svelte:head>
	<title>Draft Tool</title>
</svelte:head>

<div class="grid min-h-screen grid-cols-12 gap-5">
	{#if draftData}
		<DraftDisplay {draftData} {otherTrainerData} />
		<TeamDisplay {trainerPokemonData} />
		<PokedexDisplay {pokemonSelection} {userActive} />
	{:else}
		<div />
		<div />
		<div />
	{/if}

	<div />

	<form action="/auth/signout" class="self-end" method="POST">
		<Button class="w-full rounded-none rounded-tl-lg" type="submit">Sign out</Button>
	</form>
</div>
