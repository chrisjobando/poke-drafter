import { redirect } from '@sveltejs/kit';

const partialAuthRoutes = ['/auth/create-profile', '/auth/sign'];

export const load = async ({ url, locals: { getSession } }) => {
	const session = await getSession();

	// If user is signed in and not currently signing out,
	// do not allow them to access auth pages
	if (session && !partialAuthRoutes.includes(url.pathname)) {
		throw redirect(303, '/');
	}
};
