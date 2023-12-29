import { redirect } from '@sveltejs/kit';

// Interfaces
import type { LayoutServerLoad } from './$types';

const authRoutes = ['/auth/create-profile', '/auth/signout'];

export const load: LayoutServerLoad = async ({ url, locals: { getSession } }) => {
	const session = await getSession();

	// If user is signed in and not currently signing out,
	// do not allow them to access auth pages
	if (session && !authRoutes.includes(url.pathname)) {
		throw redirect(303, '/');
	}
};
