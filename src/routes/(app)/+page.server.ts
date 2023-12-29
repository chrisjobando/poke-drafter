import { capitalizeFirstLetter, lowercaseString } from '$lib/utils.js';
import { redirect } from '@sveltejs/kit';
import { PokemonClient } from 'pokenode-ts';

// Interfaces
import type { IPokemon } from '$lib/db/schema/DatabaseTypes.js';
import type { Pokemon } from 'pokenode-ts';
import type { Actions } from './$types.js';

export const load = async ({ locals: { getTrainer } }) => {
	const trainerData = await getTrainer();

	if (!trainerData) {
		throw redirect(307, '/auth/create-profile');
	}
};

export const actions: Actions = {
	previewPokemon: async ({ request }) => {
		const formData = await request.formData();
		const pokemon_name = formData.get('pokemon_name') as string;

		const lower_pokemon_name = lowercaseString(pokemon_name);

		const pokemonApi = new PokemonClient();
		let pokemonData: Pokemon | undefined;

		try {
			pokemonData = await pokemonApi.getPokemonByName(lower_pokemon_name);
		} catch (error) {
			console.error(error);
		}

		let selectedPokemon: IPokemon | undefined;

		if (pokemonData) {
			selectedPokemon = {
				avatar_url: pokemonData.sprites.front_default,
				id: pokemonData.id.toString(),
				name: pokemonData.name,
				pokemon_id: pokemonData.id.toString(),
				team_id: null,
				type: pokemonData.types.map((type) => capitalizeFirstLetter(type.type.name)),
				weakness: []
			};
		}

		return {
			selectedPokemon
		};
	}
};
``;
