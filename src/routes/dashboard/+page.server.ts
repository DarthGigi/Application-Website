import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { Applications } from '../../lib/database/models/application';
import type { Application } from '../../lib/database/models/application';
import { isSessionValid } from '../../lib/auth/index';
import { connectionStatus, connectToDB } from '$lib/database';
import { ConnectionStates } from 'mongoose';

export const load: PageServerLoad = async ({ cookies }) => {
  const session = await isSessionValid(cookies);
  if (!session) {
    throw redirect(302, '/login');
  }
  // Load all applications
  const apps: Application[] = [];

  try {
    if (connectionStatus.status != ConnectionStates.connected) {
      await connectToDB();
    }
  } catch (e) {
    console.log(e);
  }

  const dbSearch = await Applications.find({});

  dbSearch.forEach((doc) => {
    apps.push(doc as Application);
  });

  return {
    streamed: apps.map((app) => app as object)
  };
};
