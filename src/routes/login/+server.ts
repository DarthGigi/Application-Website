import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GetAuthorizationURL } from '../../lib/server/oauth/';
import { hash } from '$lib/server/hash';

export const GET = (async ({ getClientAddress }) => {
  const ip = hash(getClientAddress());
  throw redirect(302, GetAuthorizationURL(ip.substring(0, Math.floor(Math.random() * ip.length)), 'consent'));
}) satisfies RequestHandler;
