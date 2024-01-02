<script lang="ts">
	// Forms
	import { enhance } from '$app/forms';
	// Components
	import { Button, Heading, Spinner } from 'flowbite-svelte';
	import PokemonInformationDisplay from '../pokemon/PokemonInformationDisplay.svelte';
	import PokemonSearch from './PokemonSearch.svelte';
	// Interfaces
	import type { IPokemonSelection } from '../store/pokemonSelectionStore.svelte';

	interface IPokedexDisplayProps {
		userActive: boolean;
		pokemonSelection: IPokemonSelection;
	}

	const { pokemonSelection, userActive } = $props<IPokedexDisplayProps>();
</script>

{#if userActive}
	<div class="col-span-6 flex h-full flex-col justify-center">
		<div
			class="flex h-[200px] w-full items-center justify-center rounded-t-3xl border-2 border-black bg-primary-700"
		/>
		<div class="h-[400px] w-full border-x-2 border-black bg-cyan-400 px-12 py-6">
			<PokemonSearch {pokemonSelection} />
			<PokemonInformationDisplay {pokemonSelection} />
		</div>
		<div
			class="flex h-[200px] w-full items-center justify-center rounded-b-3xl border-2 border-black bg-primary-700"
		>
			{#if pokemonSelection.selectedPokemon}
				<form
					action="?/draftPokemon"
					method="POST"
					use:enhance={({ formData }) => {
						formData.set('pokemon_data', JSON.stringify(pokemonSelection.selectedPokemon));

						return async () => {
							pokemonSelection.pokemonName = '';
							pokemonSelection.selectedPokemon = undefined;
						};
					}}
				>
					<Button color="dark" pill size="xl" type="submit">DRAFT</Button>
				</form>
			{/if}
		</div>
	</div>
{:else}
	<div class="col-span-6 flex h-full flex-col justify-center">
		<div
			class="flex h-[200px] w-full items-center justify-center rounded-t-3xl border-2 border-black bg-primary-700"
		>
			<Spinner class="me-3" size="8" color="white" />
			<Heading class="w-min whitespace-nowrap text-white" tag="h2">Please wait...</Heading>
		</div>
		<div class="h-[200px] w-full rounded-b-3xl border-x-2 border-b-2 border-black bg-primary-700" />
	</div>
{/if}
