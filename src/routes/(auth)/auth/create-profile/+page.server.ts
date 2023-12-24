import { CreateTrainerSchema } from '$lib/db/schema/UserSchema.js';
import { fault, formatError } from '$lib/db/utils.js';
import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import { ZodError } from 'zod';

import type { Actions } from './$types.js';

export const load = async ({ locals: { getTrainer } }) => {
	const trainerData = await getTrainer();

	if (trainerData) {
		throw redirect(307, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const formData = await request.formData();
		const display_name = formData.get('name') as string;

		try {
			CreateTrainerSchema.parse({ name });
		} catch (err) {
			if (err instanceof ZodError) {
				const errors = formatError(err);
				return fail(400, fault('', { errors, name }));
			}
		}

		const session = await getSession();

		if (!session) {
			throw redirect(307, '/auth/signup');
		}

		const auth_id = session.user.id;

		const { error: createTrainerError } = await supabase
			.from('trainers')
			.insert({ auth_id, display_name });

		if (createTrainerError) {
			if (createTrainerError instanceof AuthApiError && createTrainerError.status === 400) {
				return fail(400, fault('Invalid credentials.', { display_name }));
			}

			return fail(500, fault(createTrainerError.message, { display_name }));
		}

		return redirect(307, '/');
	}
};
