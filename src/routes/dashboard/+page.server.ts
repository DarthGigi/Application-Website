import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import Applications from '$lib/server/database/models/application';
import { isSessionValid } from '../../lib/server/auth/index';
import { connectionStatus, connectToDB } from '$lib/server/database';
import { ConnectionStates } from 'mongoose';
import type { Application, FormResponses, FormAgreements } from '$lib/types/application';

export const load: PageServerLoad = async ({ cookies }) => {
  const s = await isSessionValid(cookies);
  if (!s) {
    throw redirect(302, '/login');
  }
  // Load all applications
  try {
    if (connectionStatus.status != ConnectionStates.connected) {
      await connectToDB();
    }
  // eslint-disable-next-line no-empty
  } catch (_) {}

  const apps: Application[] = [];

  const fetchedApps = await Applications.find({});

  fetchedApps.map((a) => {
    const app: Application = a.toObject({ getters: false }) as Application;
    app.responses = JSON.parse(app.responses as string) as FormResponses;
    app.agreements = JSON.parse(app.agreements as string) as FormAgreements;
    apps.push(app);
  });

  // little hack
  return {
    streamed: {
      applications: structuredClone(apps)
    }
  };
};
