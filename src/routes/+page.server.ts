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

let ip = '';

export async function load(event) {
  const form = await superValidate(event, formSchema);
  ip = event.getClientAddress();
  return {
    props: {
      form
    }
  };
}

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, formSchema);

    if (!form.valid) {
      console.log('Form is not valid');
      console.log(
        fail(400, {
          form
        })
      );

      return fail(400, {
        form
      });
    }

    try {
      // check if email is already in use or if the discordID is already in use
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
              },
              {
                ipAddress: {
                  contains: event.getClientAddress()
                }
              }
            ]
          }
        });

        if (existingApplication !== null) {
          console.log('Application already exists');
          console.log(
            fail(400, {
              form,
              message: 'Application already exists'
            })
          );

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
