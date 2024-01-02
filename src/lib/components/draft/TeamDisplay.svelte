<script lang="ts">
	import PokemonPreview from '../pokemon/PokemonPreview.svelte';

	// Interfaces
	import type { IPokemon } from '$lib/db/schema/DatabaseTypes';

	interface ITeamDisplayProps {
		trainerPokemonData?: IPokemon[];
	}

	const { trainerPokemonData: trainerPokemonDataProp } = $props<ITeamDisplayProps>();

	// State
	let trainerPokemonData = $state<IPokemon[]>(trainerPokemonDataProp ?? []);
</script>

<div class="col-span-2 flex h-full items-center justify-center">
	<div class="flex flex-col gap-6">
		<PokemonPreview pokemon={trainerPokemonData[0]} size="lg" />
		<PokemonPreview pokemon={trainerPokemonData[1]} size="lg" />
		<PokemonPreview pokemon={trainerPokemonData[2]} size="lg" />
		<PokemonPreview pokemon={trainerPokemonData[3]} size="lg" />
		<PokemonPreview pokemon={trainerPokemonData[4]} size="lg" />
		<PokemonPreview pokemon={trainerPokemonData[5]} size="lg" />
	</div>
</div>
