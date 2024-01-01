<script lang="ts">
	import { Avatar } from 'flowbite-svelte';
	// Interfaces
	import type { IPokemon } from '$lib/db/schema/DatabaseTypes';

	interface IPokemonPreviewProps {
		pokemon?: Pick<IPokemon, 'avatar_url' | 'name'>;
		size?: 'sm' | 'lg';
	}

	const { size = 'sm', pokemon } = $props<IPokemonPreviewProps>();
</script>

<Avatar alt={pokemon?.name ?? 'Empty Slot'} src={pokemon?.avatar_url ?? undefined} {size} />
