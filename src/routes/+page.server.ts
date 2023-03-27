import type { Action, Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { prisma } from '$lib/server/prisma';
import { superValidate } from 'sveltekit-superforms/server';

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

export async function load(event) {
  const form = await superValidate(event, formSchema);
  return {
    props: {
      form
    }
  };
}

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
    console.log(form);

    const ip = event.getClientAddress();
    if (!form.valid) {
      return fail(400, {
        form
      });
    }

    const token = await (await event.request.formData()).get('cf-turnstile-response');
    console.log(token);
    const SECRET_KEY = process.env.CF_TURNSTILE_SECRET_KEY;

    // Validate the token
    const { success, error } = await validateToken(token, SECRET_KEY);
    console.log(success, error);
    if (!success) {
      return fail(400, {
        message: error || 'Invalid CAPTCHA'
      });
    }

    try {
      try {
        const existingApplication: object | null = await prisma.application.findFirst({
          where: {
            OR: [
              {
                email: {
                  contains: form.data.email
                }
              },
              {
                discordID: {
                  contains: form.data.discordID
                }
              }
              // {
              //   ipAddress: {
              //     contains: ip
              //   }
              // }
            ]
          }
        });

        if (existingApplication !== null) {
          return fail(400, {
            form,
            message: 'Application already exists'
          });
        }
      } catch (err) {
        console.error(err);
        return fail(500, { message: 'Something went horribly wrong', form });
      }

      const newApplication: object | null = await prisma.application.create({
        data: {
          name: form.data.name,
          email: form.data.email,
          discordID: form.data.discordID,
          siriusUsage: form.data.siriusUsage,
          siriusDiscovery: form.data.siriusDiscovery,
          question1: form.data.question1,
          question2: form.data.question2,
          question3: form.data.question3,
          question4: form.data.question4,
          question5: form.data.question5,
          question6: form.data.question6,
          question7: form.data.question7,
          question8: form.data.question8,
          question9: form.data.question9,
          question10: form.data.question10,
          question11: form.data.question11,
          contactStaff: form.data.contactStaff === 'yes',
          contactInfo: form.data.contactInfo === 'yes',
          data: form.data.data === 'yes',
          ipAddress: ip
        }
      });
    } catch (err) {
      console.error(err);
      return fail(500, { message: 'Something went wrong', form });
    }

    return { form };
  }
};
