import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import { redirect } from '@sveltejs/kit';

// Interfaces
import type { IOtherTrainer } from '$lib/db/schema/DatabaseTypes';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '/' });
			}
		}
	});

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	event.locals.getTrainer = async () => {
		const session = await event.locals.getSession();

		if (!session) {
			throw redirect(307, '/auth/signin');
		}

		const { data: trainerData } = await event.locals.supabase
			.from('trainers')
			.select('*')
			.eq('auth_id', session.user.id)
			.maybeSingle();

		return trainerData;
	};

	event.locals.getDraft = async () => {
		const { data: draftData } = await event.locals.supabase
			.from('drafts')
			.select('*')
			.eq('is_active', true)
			.maybeSingle();

		return draftData;
	};

	event.locals.getTeam = async (activeGym: string, trainerId: string) => {
		const { data: teamData } = await event.locals.supabase
			.from('teams')
			.select('*')
			.eq('trainer_id', trainerId)
			.eq('gym_id', activeGym)
			.maybeSingle();

		if (!teamData) {
			const { data: newTeamData } = await event.locals.supabase
				.from('teams')
				.insert({
					gym_id: activeGym,
					trainer_id: trainerId
				})
				.select('*')
				.single();

			return newTeamData;
		}

		return teamData;
	};

	event.locals.getTeamPokemon = async (teamId: string) => {
		const { data: pokemonData } = await event.locals.supabase
			.from('pokemon')
			.select('*')
			.eq('team_id', teamId)
			.order('created_at', { ascending: true });

		return pokemonData;
	};

	event.locals.getOtherTrainers = async (activeGymId: string, trainerId: string) => {
		const { data: otherTrainersData } = await event.locals.supabase
			.from('trainers')
			.select('*')
			.eq('role', 'trainer')
			.neq('id', trainerId);

		if (!otherTrainersData) {
			return null;
		}

		const otherTrainersDataArr: IOtherTrainer[] = [];

		for (const otherTrainer of otherTrainersData) {
			const otherTrainerTeamData = await event.locals.getTeam(activeGymId, otherTrainer.id);

			if (!otherTrainerTeamData) {
				otherTrainersDataArr.push({
					teamPokemonData: [],
					trainerData: otherTrainer
				});

				continue;
			}

			const otherTrainerTeamPokemonData = await event.locals.getTeamPokemon(
				otherTrainerTeamData.id
			);

			otherTrainersDataArr.push({
				teamPokemonData: otherTrainerTeamPokemonData ?? [],
				trainerData: otherTrainer,
				trainerTeamId: otherTrainerTeamData.id
			});
		}

		return otherTrainersDataArr;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
