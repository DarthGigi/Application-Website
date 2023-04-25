import type { PageServerLoad } from '../dashboard/$types';
import { validateSession } from '$lib/server/auth/';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ cookies }) => {
  const s = await validateSession(cookies);

  if (!s) {
    throw redirect(302, '/login');
  }

  if (s.user.discord.Guild.roles.includes('1100444313172852777') === false) {
    // blacklisted
    throw redirect(302, '/');
  }

  return {};
}) satisfies PageServerLoad;
