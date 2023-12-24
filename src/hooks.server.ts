import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	/**
	 * a little helper that is written for convenience so that instead
	 * of calling `const { data: { session } } = await supabase.auth.getSession()`
	 * you just call this `await getSession()`
	 */
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
