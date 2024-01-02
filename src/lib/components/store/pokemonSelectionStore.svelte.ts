import type { IPokemon } from '$lib/db/schema/DatabaseTypes';

export interface IPokemonSelection {
	pokemonName: string;
	selectedPokemon: IPokemon | undefined;
}

export function createPokemonSelection(): IPokemonSelection {
	let pokemonName = $state<string>('');
	let selectedPokemon = $state<IPokemon | undefined>();

	return {
		get pokemonName() {
			return pokemonName;
		},
		get selectedPokemon() {
			return selectedPokemon;
		},
		set pokemonName(searchQuery: string) {
			pokemonName = searchQuery;
		},
		set selectedPokemon(pokemonData: IPokemon | undefined) {
			selectedPokemon = pokemonData;
		}
	};
}
