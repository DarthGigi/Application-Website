import type { Actions, PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { Users } from '$lib/server/database/models/user';
import { isSessionValid, newSession } from '$lib/server/auth';
import * as argon2 from 'argon2';
import { hash } from '$lib/server/hash';
import { v4 } from 'uuid';
import { connectionStatus, connectToDB } from '$lib/server/database/';
import { ConnectionStates } from 'mongoose';
import { Secrets } from '$lib/server/database/models/secrets';

export const load: PageServerLoad = async ({ cookies }) => {
  if (await isSessionValid(cookies)) {
    throw redirect(302, '/dashboard');
  }
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = Object.fromEntries(await request.formData()) as Record<string, string>;

    try {
      if (connectionStatus.status != ConnectionStates.connected) {
        await connectToDB();
      }
    } catch (e) {
      console.log(e);
    }

    const sDoc = await Secrets.findOneAndDelete({ Secret: data.secret });
    //if(!sDoc) return fail(400, { message: 'invalid secret' });

    data.username = data.username.toLowerCase();

    if ((await Users.find({ username: data.username })).length > 0) return fail(400, { message: 'username taken' });

    const password = await argon2.hash(data.password, { type: argon2.argon2id, memoryCost: 2 ** 16, hashLength: 50 });

    //little hack to clear it out of memory for security
    delete data.password;

    const userID = hash(v4());

    await new Users({ _id: userID, password, username: data.username, admin: false }).save();

    await newSession(cookies, userID)

    throw redirect(301, '/dashboard');
  }
};
