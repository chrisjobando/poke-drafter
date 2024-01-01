<script lang="ts">
	import cx from 'classnames';
	import { PokemonPreview } from '../pokemon';
	// Interfaces
	import type { ITrainer } from '$lib/db/schema/DatabaseTypes';

	interface OtherTrainerDisplayProps {
		trainerData: ITrainer;
		active?: boolean;
	}

	const { active, trainerData } = $props<OtherTrainerDisplayProps>();

	const mockPokemon = {
		name: 'Pikachu',
		avatar_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
	};

	const mockPokemon2 = {
		name: 'Charmander',
		avatar_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'
	};

	const mockPokemon3 = {
		name: 'Squirtle',
		avatar_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png'
	};
</script>

<div class={cx('box-border h-auto min-h-[80px] w-full px-4 py-2', { 'bg-primary-600': active })}>
	<p>
		{trainerData.display_name}
	</p>

	<div class="flex h-8 flex-wrap gap-1">
		<PokemonPreview pokemon={mockPokemon} />
		<PokemonPreview pokemon={mockPokemon2} />
		<PokemonPreview pokemon={mockPokemon3} />
		<PokemonPreview />
		<PokemonPreview />
		<PokemonPreview />
	</div>
</div>
