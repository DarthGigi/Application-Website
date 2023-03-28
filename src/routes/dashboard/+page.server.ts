import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { Applications } from '../../lib/database/models/application';
import type { Application } from '../../lib/database/models/application';
import { validateSession } from '../../lib/auth/index';
import { connectionStatus, connectToDB } from '$lib/database';
import { ConnectionStates } from 'mongoose';


export const load: PageServerLoad = async () => {
  // Load all applications
  try {
    if (connectionStatus.status != ConnectionStates.connected) {
      await connectToDB();
    }
  } catch (e) {
    console.log(e);
  }

  // little hack
  return {
    streamed: {
        applications: await Applications.find({})
    }
  };
};
