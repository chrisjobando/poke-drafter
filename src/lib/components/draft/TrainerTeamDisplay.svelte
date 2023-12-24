<script lang="ts">
	// Utils
	import { capitalizeFirstLetter } from '$lib/utils';
	// Interfaces
	import type { IPokemon } from '$lib/db/schema/DatabaseTypes';

	interface ITrainerTeamDisplayProps {
		trainer_pokemon?: IPokemon[];
	}

	const { trainer_pokemon } = $props<ITrainerTeamDisplayProps>();
</script>

{#if trainer_pokemon && trainer_pokemon.length}
	<div class="flex flex-wrap items-center">
		{#each trainer_pokemon as pokemon}
			<div class="avatar m-2 flex flex-col items-center justify-center">
				<img
					alt={`${pokemon.name} Sprite`}
					src={pokemon.avatar_url}
					class="flex h-32 w-32 items-center justify-center rounded-full bg-neutral p-4"
				/>
				<h4 class="mt-2 text-center">{capitalizeFirstLetter(pokemon.name)}</h4>
			</div>
		{/each}
	</div>
{:else}
	<span class="font-bold">No Pokemon have been drafted yet.</span>
{/if}
