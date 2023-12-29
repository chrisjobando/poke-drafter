import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import { redirect } from '@sveltejs/kit';

// Interfaces
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

	event.locals.getTeam = async () => {
		const trainerData = await event.locals.getTrainer();
		const draftData = await event.locals.getDraft();

		if (!trainerData || !draftData || !draftData.active_gym) {
			return null;
		}

		const { data: teamData } = await event.locals.supabase
			.from('teams')
			.select('*')
			.eq('trainer_id', trainerData.id)
			.eq('gym_id', draftData.active_gym)
			.maybeSingle();

		return teamData;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
