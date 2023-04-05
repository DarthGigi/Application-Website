import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { GetAuthorizationURL } from '../../lib/server/oauth/';
import { hash } from '$lib/server/hash';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    const ip = hash(event.getClientAddress());
    throw redirect(302, GetAuthorizationURL(ip.substring(0, Math.floor(Math.random() * ip.length)), 'consent'));
  }
};
