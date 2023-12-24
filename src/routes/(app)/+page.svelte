<script lang="ts">
	// Forms
	import { enhance } from '$app/forms';
	// Components
	import PokemonSearch from '$lib/components/PokemonSearch.svelte';
	import SelectedPokemonDisplay from '$lib/components/draft/SelectedPokemonDisplay.svelte';
	import TrainerTeamDisplay from '$lib/components/draft/TrainerTeamDisplay.svelte';
	// Interfaces
	import type { IPokemon } from '$lib/db/schema/DatabaseTypes';
	import type { ActionData, PageData } from './$types';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();

	const {
		current_gym: initial_gym,
		current_pick: initial_trainer,
		current_round: initial_round,
		trainer_name,
		trainer_team,
		trainer_pokemon: initial_pokemon,
		supabase
	} = data;

	// State
	let current_gym = $state<string | undefined>(initial_gym);
	let current_pick = $state<string | undefined>(initial_trainer);
	let current_round = $state<number | undefined>(initial_round);

	let searchQuery = $state<string>('');
	let filteredNames = $state<string[]>([]);

	let selectedPokemon = $state<IPokemon | undefined>();
	let trainer_pokemon = $state<IPokemon[] | undefined>(initial_pokemon);

	// Form Ref
	let formRef = $state<HTMLFormElement | undefined>();

	// Search Results
	$effect(() => {
		if (form && form.selectedPokemon) {
			selectedPokemon = form.selectedPokemon;
		}
	});

	// Subscriptions
	const draftChannel = supabase.channel('draft-channel');

	draftChannel.on(
		'postgres_changes',
		{ event: 'UPDATE', schema: 'public', table: 'drafts' },
		async (payload) => {
			const updatedDraftData = payload.new;

			if (updatedDraftData.round_number) current_round = updatedDraftData.round_number;

			const { data: updated_gym } = await supabase
				.from('gyms')
				.select('gym_name')
				.eq('id', updatedDraftData.active_gym)
				.maybeSingle();

			if (updated_gym) current_gym = updated_gym.gym_name;

			const { data: updated_trainer } = await supabase
				.from('trainers')
				.select('display_name')
				.eq('id', updatedDraftData.active_trainer)
				.maybeSingle();

			if (updated_trainer) current_pick = updated_trainer.display_name;
		}
	);

	draftChannel.on(
		'postgres_changes',
		{ event: 'INSERT', schema: 'public', table: 'pokemon' },
		async (payload) => {
			const newPokemonData = payload.new as IPokemon;

			if (trainer_team && trainer_pokemon && newPokemonData.team_id === trainer_team.id) {
				trainer_pokemon?.push(newPokemonData);

				// Reset form values
				searchQuery = '';
				filteredNames = [];
				selectedPokemon = undefined;
			}
		}
	);

	draftChannel.subscribe();
</script>

<svelte:head>
	<title>Draft Tool</title>
</svelte:head>

<h1 class="text-2xl">Welcome, {trainer_name}</h1>

{#if current_gym}
	<div role="alert" class="alert alert-error mt-4">
		<span class="text-2xl font-bold">Round: {current_round}</span>
		<span class="ml-auto text-2xl font-bold">Current Draft: {current_gym} Gym</span>
	</div>

	{#if trainer_name === current_pick}
		<h2 class="mt-4 text-xl font-bold">Your Pick!</h2>

		<div class="mx-auto flex h-[400px] w-64 flex-col justify-center">
			{#if selectedPokemon}
				<SelectedPokemonDisplay bind:selectedPokemon />
			{/if}
		</div>

		<form
			action="?/previewPokemon"
			method="post"
			bind:this={formRef}
			use:enhance={({ formData }) => {
				formData.set('pokemon_name', searchQuery);

				return async ({ update }) => {
					// Prevent clearing form inputs on submit
					await update({ reset: false });
				};
			}}
		>
			<PokemonSearch
				name="pokemon_name"
				placeholder="Enter name here"
				bind:filteredNames
				bind:searchQuery
				bind:formRef
			/>
		</form>

		<h2 class="mt-4 text-xl">Your Team:</h2>

		<TrainerTeamDisplay bind:trainer_pokemon />
	{:else}
		<h2 class="mt-4 text-xl">Current Pick: <span class="font-bold">{current_pick}</span></h2>
	{/if}
{:else}
	<h2 class="mt-4">No active draft.</h2>
{/if}

<style lang="postcss">
	.avatar p {
		display: none;
	}

	.avatar:hover p {
		display: block;
	}
</style>
