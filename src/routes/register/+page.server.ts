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
  default: async ({ request }) => {
    const { name, password, secret } = Object.fromEntries(await request.formData()) as Record<string, string>;
    if (secret !== process.env.SECRET) {
      console.error('Invalid secret');
      return fail(400, { message: 'Invalid secret' });
    }

    try {
      await auth.createUser({
        primaryKey: {
          providerId: 'username',
          providerUserId: name,
          password: password
        },
        attributes: {
          name,
          password: password
        }
      });
    } catch (err) {
      console.error(err);
      return fail(400, { message: 'Could not register user' });
    }

    throw redirect(302, '/login');
  }
};
