import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { isSessionValid, newSession } from '$lib/auth';
import { verify } from 'argon2';
import { Users } from '$lib/database/models/user';
import { connectionStatus, connectToDB } from '$lib/database';
import { ConnectionStates } from 'mongoose';

export const load: PageServerLoad = async ({ cookies }) => {
    if (await isSessionValid(cookies)) {
        throw redirect(302, '/dashboard');
    }
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = Object.fromEntries(await request.formData()) as Record<string, string>;
    
    try {
        if(connectionStatus.status != ConnectionStates.connected) {
            await connectToDB();
        }
    } catch(e) {console.log(e);}

    const user = await Users.findOne({username: data.username.toLowerCase()});
    
    if(!user || !(await verify(user.password, data.password))) return fail(400, {"message": "Incorrect username/password!"});

    await newSession(cookies, user._id);

    throw redirect(302, '/dashboard');
  }
};
