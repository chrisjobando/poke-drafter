<script lang="ts">
	// Components
	import { Heading, Li, List, P } from 'flowbite-svelte';
	import PokemonPreview from './PokemonPreview.svelte';
	// Utils
	import { capitalizeFirstLetter } from '$lib/utils';
	import cx from 'classnames';
	// Interfaces
	import type { IPokemonSelection } from '../store/pokemonSelectionStore.svelte';

	interface IPokemonInformationDisplayProps {
		pokemonSelection: Pick<IPokemonSelection, 'selectedPokemon'>;
	}

	const { pokemonSelection } = $props<IPokemonInformationDisplayProps>();
</script>

{#if pokemonSelection.selectedPokemon}
	<div class="mt-8 flex flex-col">
		<Heading tag="h2" class="text-center"
			>{capitalizeFirstLetter(pokemonSelection.selectedPokemon.name)}</Heading
		>

		<div class="mt-4 flex justify-center">
			<PokemonPreview pokemon={pokemonSelection.selectedPokemon} size="xl" />

			<div class="ml-16">
				{#if pokemonSelection.selectedPokemon.type.length > 1}
					<P
						><span class="text-xl font-bold">Types:</span>
						{pokemonSelection.selectedPokemon.type.join(', ')}</P
					>
				{:else}
					<P
						><span class="text-xl font-bold">Type:</span>
						{pokemonSelection.selectedPokemon.type[0] ?? 'None'}</P
					>
				{/if}

				{#if pokemonSelection.selectedPokemon.weakness.length > 1}
					<P
						><span class="text-xl font-bold">Weakness:</span>
						{pokemonSelection.selectedPokemon.weakness.join(', ')}</P
					>
				{:else}
					<P
						><span class="text-xl font-bold">Weaknesses:</span>
						{pokemonSelection.selectedPokemon.weakness[0] ?? 'None'}</P
					>
				{/if}
				{#if pokemonSelection.selectedPokemon.evolution_chain}
					<span class="text-xl font-bold">Evolutions:</span>
					<List tag="ul" class="space-y-1">
						{#each pokemonSelection.selectedPokemon.evolution_chain as evolutionPokemon}
							<Li
								class={cx({
									'font-bold': evolutionPokemon === pokemonSelection.selectedPokemon.name
								})}>{capitalizeFirstLetter(evolutionPokemon)}</Li
							>
						{/each}
					</List>
				{/if}
			</div>
		</div>
	</div>
{/if}
