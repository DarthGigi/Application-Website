import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.validate();
  if (session) {
    throw redirect(302, '/dashboard');
  }
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const { name, password } = Object.fromEntries(await request.formData()) as Record<string, string>;

    try {
      const key = await auth.useKey('username', name, password);
      const session = await auth.createSession(key.userId);
      locals.setSession(session);
    } catch (err) {
      console.error(err);
      return fail(401, { message: 'Could not login user' });
    }

    throw redirect(302, '/dashboard');
  }
};
