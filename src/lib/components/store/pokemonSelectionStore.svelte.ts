export function createSelection() {
	let selectedPokemon = $state<string>('');

	return {
		get selectedPokemon() {
			return selectedPokemon;
		},
		set selectedPokemon(searchQuery: string) {
			selectedPokemon = searchQuery;
		}
	};
}
