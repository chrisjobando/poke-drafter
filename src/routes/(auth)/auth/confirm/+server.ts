import { redirect } from '@sveltejs/kit';

import type { EmailOtpType } from '@supabase/supabase-js';

export const GET = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;
	const token_hash = url.searchParams.get('token_hash') as string;
	const type = (url.searchParams.get('type') ?? 'email') as EmailOtpType;
	let next = url.searchParams.get('next') ?? '/';

	if (token_hash && type) {
		const { error } = await supabase.auth.verifyOtp({ token_hash, type });
		if (error) {
			next = `/auth/signin${next ? '?next=' + next : ''}`;
		}
	}

	throw redirect(303, `/${next.slice(1)}`);
};
