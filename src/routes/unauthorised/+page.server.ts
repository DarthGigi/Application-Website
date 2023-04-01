import type { PageServerLoad } from '../$types';
import { validateSession } from '$lib/server/auth/';
import { error, redirect } from '@sveltejs/kit';

export const load = (async ({ cookies }) => {
  const s = await validateSession(cookies);
  if (!s) {
    throw redirect(302, '/login');
  }
  return {};
}) satisfies PageServerLoad;
