import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import Applications from '$lib/server/database/models/application';
import { ApplicationStatus, type FormResponses, type FormAgreements } from '$lib/types/application';
import { v4 } from 'uuid';
import { connectionStatus, connectToDB } from '$lib/server/database/index';
import mongoose from 'mongoose';
import type { PageServerLoad } from './$types';
import type { Application } from '$lib/types/application';
import { validateSession } from '$lib/server/auth';

const botDetect = new RegExp('/(bot)/gm');

const formSchema = z.object({
  name: z.string().min(1),
  siriusUsage: z.string().min(1),
  siriusDiscovery: z.string().min(1),
  question1: z.string().min(1),
  question2: z.string().min(1),
  question3: z.string().min(1),
  question4: z.string().min(1),
  question5: z.string().min(1),
  question6: z.string().min(1),
  question7: z.string().min(1),
  question8: z.string().min(1),
  question9: z.string().min(1),
  question10: z.string().min(1),
  question11: z.string().min(1),
  contactStaff: z.string().min(2),
  contactInfo: z.string().min(2),
  data: z.string().min(2)
});

export const load = (async (event) => {
  const sess = await validateSession(event.cookies);
  const ua = event.request.headers.get('User-Agent');
  if (!ua || botDetect.test(ua as string)) {
    return {};
  }
  if (!sess) throw redirect(302, '/login');

  const form = await superValidate(event, formSchema);
  return {
    props: {
      form
    }
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    const session = await validateSession(event.cookies);

    // this is a rare case
    if (!session) throw redirect(302, '/login');

    // Validate the form itself
    const form = await superValidate(await event.request.clone().formData(), formSchema);

    if (!form.valid) return fail(400, { form });

    try {
      if (connectionStatus.status != mongoose.ConnectionStates.connected) {
        await connectToDB();
      }
      // eslint-disable-next-line no-empty
    } catch (_) {}
    const existingApplication: Document[] = await Applications.find({ $or: [{ 'discord.User.id': session.user.discord.User.id }] });
    const existingApplication: Document[] = await Applications.find({ $or: [{ 'discord.User.id': session.user.discord.User.id }] });

    if (existingApplication.length !== 0) {
      return fail(400, {
        message: "You've already submitted an application!"
      });
    }

    const data = form.data;

    const questions: string[] = [];
    for (const key in data) {
      if (key.startsWith('question')) {
        // hack to make ts' compiler approve of it
        questions.push(data[key as keyof typeof data]);
      }
    }

    const responses: FormResponses = {
      Discovery: form.data.siriusDiscovery,
      Usage: form.data.siriusUsage,
      Questions: questions
    };

    const agreements: FormAgreements = {
      Staff: form.data.contactStaff == 'on',
      Info: form.data.contactInfo == 'on'
    };

    // create and save new app
    const app: Application = {
      _id: v4(),
      name: form.data.name,
      responses,
      agreements,
      createdAt: new Date(),
      status: ApplicationStatus.PENDING,
      discord: session.user.discord
    };

    await new Applications(app).save();

    return {
      form
    };
  }
};
