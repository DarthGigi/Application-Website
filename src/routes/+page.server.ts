import type { Actions } from './$types';
import { CF_TURNSTILE_SECRET_KEY } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import Applications from '$lib/server/database/models/application';
import { ApplicationStatus, type FormResponses, type FormAgreements } from '$lib/types/application';
import { v4 } from 'uuid';
import { connectionStatus, connectToDB } from '$lib/server/database/index';
import { hash } from '$lib/server/hash';
import { ConnectionStates } from 'mongoose';
import type { PageServerLoad } from './$types';
import type { Application } from '$lib/types/application';
import { GetAuthorizationURL } from '$lib/server/oauth';

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  discordID: z.string().min(17),
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
  const form = await superValidate(event, formSchema);
  return {
    props: {
      form
    }
  };
}) satisfies PageServerLoad;

// Cloudflare Turnstile
interface TokenValidateResponse {
  'error-codes': string[];
  success: boolean;
  action: string;
  cdata: string;
}

async function validateToken(token: FormDataEntryValue | string | null, secret: string | undefined) {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      response: token,
      secret: secret
    })
  });

  const data: TokenValidateResponse = await response.json();

  return {
    // Return the status
    success: data.success,

    // Return the first error if it exists
    error: data['error-codes']?.length ? data['error-codes'][0] : null
  };
}

export const actions: Actions = {
  default: async (event) => {
    // Validate the form itself
    const form = await superValidate(await event.request.clone().formData(), formSchema);

    const ip = hash(event.getClientAddress());

    if (!form.valid) return fail(400, { form });

    const token = (await event.request.formData()).get('cf-turnstile-response');
    const SECRET_KEY = CF_TURNSTILE_SECRET_KEY;

    // Validate the token
    // const { success, error } = await validateToken(token, SECRET_KEY);
    // if (!success) {
    //   return fail(400, {
    //     message: error || 'Invalid CAPTCHA'
    //   });
    // }
    try {
      if (connectionStatus.status != ConnectionStates.connected) {
        await connectToDB();
      }
      // eslint-disable-next-line no-empty
    } catch (_) {}
    const existingApplication: Document[] = await Applications.find({ $or: [{ email: form.data.email }, { discordID: form.data.discordID }, { IP: ip }] });

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
      email: form.data.email,
      responses: JSON.stringify(responses),
      agreements: JSON.stringify(agreements),
      IP: ip,
      createdAt: new Date(),
      status: ApplicationStatus.PENDING
    }

    await new Applications(app).save()

    return {
      redirectUrl: GetAuthorizationURL(app._id, "consent"),
      form
    }
  }
};
