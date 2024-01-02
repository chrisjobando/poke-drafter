<script lang="ts">
	import cx from 'classnames';
	import { PokemonPreview } from '../pokemon';
	// Interfaces
	import type { IOtherTrainer } from '$lib/db/schema/DatabaseTypes';

	interface OtherTrainerDisplayProps {
		trainerData: IOtherTrainer;
		active?: boolean;
	}

	const { active, trainerData: trainerDataProp } = $props<OtherTrainerDisplayProps>();

	const { trainerData, teamPokemonData = [] } = trainerDataProp;
</script>

<div class={cx('box-border h-auto min-h-[80px] w-full px-4 py-2', { 'bg-primary-600': active })}>
	<p>
		{trainerData.display_name}
	</p>

	<div class="flex h-8 flex-wrap gap-1">
		<PokemonPreview pokemon={teamPokemonData[0]} />
		<PokemonPreview pokemon={teamPokemonData[1]} />
		<PokemonPreview pokemon={teamPokemonData[2]} />
		<PokemonPreview pokemon={teamPokemonData[3]} />
		<PokemonPreview pokemon={teamPokemonData[4]} />
		<PokemonPreview pokemon={teamPokemonData[5]} />
	</div>
</div>
