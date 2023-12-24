<script lang="ts">
	// Forms
	import { enhance } from '$app/forms';
	// Utils
	import { capitalizeFirstLetter } from '$lib/utils';
	// Interfaces
	import type { IPokemon } from '$lib/db/schema/DatabaseTypes';

	interface ISelectedPokemonDisplayProps {
		selectedPokemon: IPokemon;
	}

	const { selectedPokemon } = $props<ISelectedPokemonDisplayProps>();
</script>

<form
	action="?/draftPokemon"
	class="group avatar flex h-64 w-64 items-center justify-center"
	method="POST"
	use:enhance={({ formData }) => {
		formData.set('pokemon_data', JSON.stringify(selectedPokemon));
	}}
>
	<img
		alt={`${selectedPokemon.name} Sprite`}
		src={selectedPokemon.avatar_url}
		class="flex h-full w-full items-center justify-center rounded-full bg-neutral p-4 group-hover:opacity-30"
	/>
	<button
		class="absolute hidden w-full text-center text-xl font-bold hover:text-red-500 group-hover:block group-hover:cursor-pointer"
		type="submit"
	>
		Pick this Pokemon!
	</button>
</form>

<h3 class="my-2 text-center text-lg font-bold">
	{capitalizeFirstLetter(selectedPokemon.name)}
</h3>

<p>
	{selectedPokemon.type.length === 1 ? 'Type' : 'Types'}:
	<span class="font-bold">{selectedPokemon.type.join(', ')}</span>
</p>
