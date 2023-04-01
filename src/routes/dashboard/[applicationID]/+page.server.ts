import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import Applications from '$lib/server/database/models/application';
import { validateSession } from '$lib/server/auth';
import { connectionStatus, connectToDB } from '$lib/server/database';
import { ConnectionStates, Document } from 'mongoose';
import { ApplicationStatus, type Application } from '$lib/types/application';
import { addUserAcceptedRole, sendAcceptLog, sendDenyLog } from '$lib/server/bot';
import { ParseStatusApplication } from '$lib/Applications';

export const load: PageServerLoad = async ({ params, cookies }) => {
  const session = await validateSession(cookies);
  if (!session) {
    throw redirect(302, '/login');
  }

  try {
    if (connectionStatus.status != ConnectionStates.connected) {
      await connectToDB();
    }
    // eslint-disable-next-line no-empty
  } catch (_) {}

  const application: Application = await Applications.findById(params.applicationID).exec();

  if (!application) throw redirect(302, '/dashboard');

  const applications = (await Applications.find({})).map((app) => app.toObject({ getters: false }) as Application);

  return {
    parsedStatus: ParseStatusApplication(application.status),
    application: JSON.parse(JSON.stringify(application)) as Application,
    streamed: {
      applications
    }
  };
};

export const actions: Actions = {
  acceptApplication: async ({ params, cookies }) => {
    try {
      if (connectionStatus.status != ConnectionStates.connected) {
        await connectToDB();
      }
      // eslint-disable-next-line no-empty
    } catch (_) {}

    const ses = await validateSession(cookies);
    if (!ses) throw redirect(302, '/login');
    const reviewer = ses.user;
    const application = ((await Applications.findById(params.applicationID)) as Document<string, null, Application> | null)?.toObject({ getters: false }) as Application;
    if (!application) {
      throw error(404, 'Application not found!');
    }

    application.status = ApplicationStatus.ACCEPTED;
    if (!application.Reviewers) application.Reviewers = [];
    application.Reviewers?.push(reviewer.discord.User.id);

    await Applications.findByIdAndUpdate(application._id, application);

    // add roles
    await addUserAcceptedRole(application.discord.User.id, '939871641209540658', `Application approved by ${reviewer.discord.User.username}`);
    await addUserAcceptedRole(application.discord.User.id, '1089307016108970035', `Application approved by ${reviewer.discord.User.username}`);

    await sendAcceptLog(application.discord, application);

    throw redirect(302, '/dashboard/' + params.applicationID);
  },
  rejectApplication: async ({ params, cookies }) => {
    try {
      if (connectionStatus.status != ConnectionStates.connected) {
        await connectToDB();
      }
      // eslint-disable-next-line no-empty
    } catch (_) {}

    const ses = await validateSession(cookies);
    if (!ses) throw redirect(302, '/login');

    const reviewer = ses.user;
    const application = ((await Applications.findById(params.applicationID)) as Document<string, null, Application> | null)?.toObject({ getters: false }) as Application;
    if (!application) {
      throw error(404, 'Application not found!');
    }

    application.status = ApplicationStatus.DENIED;
    if (!application.Reviewers) application.Reviewers = [];
    application.Reviewers.push(reviewer.discord.User.id);

    await Applications.findByIdAndUpdate(application._id, application);

    // Send messages
    await sendDenyLog(application.discord, application);

    throw redirect(302, '/dashboard/' + params.applicationID);
  },
  deleteApplication: async ({ params }) => {
    await Applications.findByIdAndDelete(params.applicationID);
    throw redirect(302, '/dashboard');
  }
};
