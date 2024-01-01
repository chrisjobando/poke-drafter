<script lang="ts">
	import { Heading, Spinner } from 'flowbite-svelte';
	import { createSelection } from '../store/pokemonSelectionStore.svelte';
	import PokemonSearch from './PokemonSearch.svelte';

	// Interfaces
	interface IPokedexDisplayProps {
		userActive: boolean;
	}

	const { userActive = true } = $props<IPokedexDisplayProps>();

	// State Variables
	const pokemonSelection = createSelection();
</script>

{#if userActive}
	<div class="col-span-6 flex h-full flex-col justify-center">
		<div
			class="flex h-[200px] w-full items-center justify-center rounded-t-3xl border-2 border-black bg-primary-700"
		/>
		<div class="h-[400px] w-full border-x-2 border-black bg-cyan-300">
			<div class="my-10 h-[320px] w-full bg-cyan-500 px-12 py-6">
				<PokemonSearch {pokemonSelection} />
			</div>
		</div>
		<div class="h-[200px] w-full rounded-b-3xl border-2 border-black bg-primary-700" />
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
