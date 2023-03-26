import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.validate();
  if (!session) {
    throw redirect(302, '/login');
  }

  try {
    // Load all applications
    return {
      streamed: {
        applications: await prisma.application.findMany({
          // sort by status
          orderBy: {
            status: 'desc'
          }
        })
      }
    };
  } catch (err) {
    console.log(err);
    return fail(500, err);
  }
};
