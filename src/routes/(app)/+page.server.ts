import { capitalizeFirstLetter, lowercaseString } from '$lib/utils.js';
import { fail, redirect } from '@sveltejs/kit';
import { EvolutionClient, PokemonClient } from 'pokenode-ts';

// Interfaces
import type {
	IDraft,
	INewPokemon,
	IOtherTrainer,
	IPokemon,
	ITrainer
} from '$lib/db/schema/DatabaseTypes.js';
import { fault, success } from '$lib/db/utils.js';
import { AuthApiError } from '@supabase/supabase-js';
import type { Pokemon } from 'pokenode-ts';
import type { Actions } from './$types.js';

interface IDraftPageLoadData {
	trainerData: ITrainer;
	draftData?: IDraft;
	otherTrainerData?: IOtherTrainer[];
	teamId?: string;
	trainerPokemonData?: IPokemon[];
}

export const load = async ({
	locals: { getDraft, getOtherTrainers, getTeam, getTeamPokemon, getTrainer }
}): Promise<IDraftPageLoadData> => {
	const trainerData = await getTrainer();

	if (!trainerData) {
		throw redirect(307, '/auth/create-profile');
	}

	const draftData = await getDraft();

	if (!draftData || !draftData.active_gym) {
		return {
			trainerData
		};
	}

	const teamData = await getTeam(draftData.active_gym, trainerData.id);

	if (!teamData) {
		return {
			trainerData,
			draftData
		};
	}

	const trainerPokemonData = await getTeamPokemon(teamData.id);

	if (!trainerPokemonData) {
		return {
			trainerData,
			draftData,
			teamId: teamData.id
		};
	}

	const otherTrainerData = await getOtherTrainers(draftData.active_gym, trainerData.id);

	if (!otherTrainerData) {
		return {
			trainerData,
			draftData,
			teamId: teamData.id,
			trainerPokemonData
		};
	}

	return {
		trainerData,
		draftData,
		teamId: teamData.id,
		otherTrainerData,
		trainerPokemonData
	};
};

export const actions: Actions = {
	previewPokemon: async ({ request }) => {
		const formData = await request.formData();
		const pokemon_name = formData.get('pokemon_name') as string;

		const lower_pokemon_name = lowercaseString(pokemon_name);

		const pokemonApiClient = new PokemonClient();
		let pokemonData: Pokemon | undefined;
		const evolutionChain: string[] = [];

		try {
			pokemonData = await pokemonApiClient.getPokemonByName(lower_pokemon_name);
			const speciesData = await pokemonApiClient.getPokemonSpeciesByName(lower_pokemon_name);
			const evolutionChainId = speciesData.evolution_chain.url.split('/').slice(-2)[0];

			if (evolutionChainId) {
				const evolutionApiClient = new EvolutionClient();
				const evolutionChainData = await evolutionApiClient.getEvolutionChainById(
					Number(evolutionChainId)
				);

				let currentEvolutionLink = evolutionChainData.chain;

				while (currentEvolutionLink) {
					evolutionChain.push(currentEvolutionLink.species.name);
					currentEvolutionLink = currentEvolutionLink.evolves_to[0];
				}
			}
		} catch (error) {
			console.error(error);
			return fail(400, fault('Error retrieving pokemon data.', { pokemon_name }));
		}

		let selectedPokemon: IPokemon | undefined;

		if (pokemonData) {
			selectedPokemon = {
				avatar_url: pokemonData.sprites.front_default,
				created_at: '',
				evolution_chain: evolutionChain,
				id: pokemonData.id.toString(),
				name: pokemonData.name,
				pokemon_id: pokemonData.id.toString(),
				team_id: null,
				type: pokemonData.types.map((type) => capitalizeFirstLetter(type.type.name)),
				weakness: [] // TODO: calculate
			};
		}

		return success('', { selectedPokemon });
	},
	draftPokemon: async ({ request, locals: { getDraft, getTeam, getTrainer, supabase } }) => {
		const formData = await request.formData();
		const pokemon_data = JSON.parse(formData.get('pokemon_data') as string) as IPokemon;

		const trainerData = await getTrainer();
		const draftData = await getDraft();

		if (!trainerData) {
			return fail(400, fault('Error retrieving trainer data.'));
		}

		if (!draftData || !draftData.active_gym) {
			return fail(400, fault('Error retrieving draft data.'));
		}
		const teamData = await getTeam(draftData.active_gym, trainerData.id);

		if (!teamData) {
			return fail(400, fault('Error retrieving team data.'));
		}

		const draftPokemonData: INewPokemon = {
			avatar_url: pokemon_data.avatar_url,
			evolution_chain: pokemon_data.evolution_chain,
			name: pokemon_data.name,
			pokemon_id: pokemon_data.pokemon_id,
			team_id: teamData.id,
			type: pokemon_data.type,
			weakness: pokemon_data.weakness
		};

		const { error: draftPokemonError } = await supabase
			.from('pokemon')
			.insert(draftPokemonData)
			.single();

		if (draftPokemonError) {
			if (draftPokemonError instanceof AuthApiError && draftPokemonError.status === 400) {
				return fail(400, fault('Pokemon already drafted.'));
			}

			return fail(500, fault(draftPokemonError.message));
		}
	}
};
