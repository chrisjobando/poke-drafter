import { fault } from '$lib/db/utils.js';
import { capitalizeFirstLetter, lowercaseString } from '$lib/utils.js';
import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import { PokemonClient } from 'pokenode-ts';

import type { INewPokemon, IPokemon, ITeam } from '$lib/db/schema/DatabaseTypes.js';
import type { Pokemon } from 'pokenode-ts';
import type { Actions } from './$types.js';

interface IHomePageLoadData {
	trainer_name?: string;
	current_round?: number;
	current_gym?: string;
	current_pick?: string;
	trainer_team?: ITeam;
	trainer_pokemon?: IPokemon[];
}

export const load = async ({ locals: { supabase, getDraft, getTrainer } }) => {
	const draftLoadData: IHomePageLoadData = {};
	const trainerData = await getTrainer();

	if (!trainerData) {
		throw redirect(307, '/auth/create-profile');
	}

	draftLoadData.trainer_name = trainerData.display_name;

	const draftData = await getDraft();

	if (!draftData || !draftData.active_gym || !draftData.is_active) {
		return draftLoadData;
	}

	draftLoadData.current_round = draftData.round_number;

	const { data: current_gym } = await supabase
		.from('gyms')
		.select('gym_name,id')
		.eq('id', draftData.active_gym)
		.maybeSingle();

	if (!current_gym) {
		return draftLoadData;
	} else {
		draftLoadData.current_gym = current_gym.gym_name;
		if (!draftData.active_trainer) {
			return draftLoadData;
		}
	}

	const { data: current_pick } = await supabase
		.from('trainers')
		.select('display_name')
		.eq('id', draftData.active_trainer)
		.maybeSingle();

	if (!current_pick) {
		return draftLoadData;
	}

	draftLoadData.current_pick = current_pick.display_name;

	const { data: current_team } = await supabase
		.from('teams')
		.select('*')
		.eq('trainer_id', draftData.active_trainer)
		.eq('gym_id', current_gym.id)
		.maybeSingle();

	let trainer_team: ITeam | null = current_team;

	if (!current_team) {
		const { data: new_team } = await supabase
			.from('teams')
			.insert({ gym_id: draftData.active_gym, trainer_id: trainerData.id })
			.select('*')
			.single();

		if (new_team) {
			trainer_team = new_team;
		}
	}

	if (!trainer_team) {
		return draftLoadData;
	}

	draftLoadData.trainer_team = trainer_team;

	const { data: trainer_pokemon } = await supabase
		.from('pokemon')
		.select('*')
		.eq('team_id', trainer_team.id);

	if (!trainer_pokemon) {
		return draftLoadData;
	}

	draftLoadData.trainer_pokemon = trainer_pokemon;

	return draftLoadData;
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
			console.log('cobando ~ file: +page.server.ts:118 ~ pokemonData:', pokemonData);
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
	},
	draftPokemon: async ({ request, locals: { supabase, getDraft, getTeam, getTrainer } }) => {
		const formData = await request.formData();
		const pokemon_data = JSON.parse(formData.get('pokemon_data') as string) as IPokemon;

		let draft_team = await getTeam();

		if (!draft_team) {
			const trainerData = await getTrainer();
			const draftData = await getDraft();

			if (!trainerData) {
				throw redirect(307, '/auth/create-profile');
			}

			if (!draftData || !draftData.active_gym || !draftData.is_active) {
				// Should never occur
				return fail(400, fault('There is no active draft to join.'));
			}

			// Create a new team
			const { data: new_team, error: createTeamError } = await supabase
				.from('teams')
				.insert({ gym_id: draftData.active_gym, trainer_id: trainerData.id })
				.select('*')
				.single();

			if (createTeamError) {
				if (createTeamError instanceof AuthApiError && createTeamError.status === 400) {
					return fail(400, fault('Team already exists.'));
				}

				return fail(500, fault(createTeamError.message));
			}

			if (new_team) {
				draft_team = new_team;
			} else {
				// Should never occur
				return fail(400, fault('Trainer does not have a team to add pokemon to.'));
			}
		}

		const drafted_pokemon: INewPokemon = {
			avatar_url: pokemon_data.avatar_url,
			name: pokemon_data.name,
			pokemon_id: pokemon_data.id,
			team_id: draft_team.id,
			type: pokemon_data.type,
			weakness: []
		};

		const { error: draftPokemonError } = await supabase
			.from('pokemon')
			.insert(drafted_pokemon)
			.single();

		if (draftPokemonError) {
			if (draftPokemonError instanceof AuthApiError && draftPokemonError.status === 400) {
				return fail(400, fault('Pokemon already drafted.'));
			}

			return fail(500, fault(draftPokemonError.message));
		}
	}
};
``;
