import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import Applications from '$lib/server/database/models/application';
import { validateSession } from '$lib/server/auth/';
import { connectionStatus, connectToDB } from '$lib/server/database';
import { ConnectionStates } from 'mongoose';
import type { Application, FormResponses, FormAgreements } from '$lib/types/application';

export const load: PageServerLoad = async ({ cookies }) => {
  const s = await validateSession(cookies);
  if (!s) {
    throw redirect(302, '/login');
  }

  if (!s.user.reviewer) throw redirect(302, '/unauthorized');

  // Load all applications
  try {
    if (connectionStatus.status != ConnectionStates.connected) {
      await connectToDB();
    }
    // eslint-disable-next-line no-empty
  } catch (_) {}

  const apps: Application[] = [];

  const fetchedApps = await Applications.find({});

  fetchedApps.map((a) => apps.push(a.toObject({ getters: false }) as Application));

  return {
    streamed: {
      applications: structuredClone(apps)
    }
  };
};
