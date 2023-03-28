import type { Cookies } from '@sveltejs/kit';
import { Sessions, type Session } from '../database/models/session';
import { connectionStatus, connectToDB } from '../database/index';
import { Users, type User } from '../database/models/user';
import { v4 } from 'uuid';
import { hash } from '$lib/hash';
import { ConnectionStates } from 'mongoose';

// one week
const MaxSession = 60480000;

const sessionCookieName = 'SiriusSession';

export const validateSession = async (cookies: Cookies): Promise<{ session: Session; user: User } | undefined> => {
  const sessionID = cookies.get(sessionCookieName);

  if (!sessionID) return;

  try {
    if(connectionStatus.status != ConnectionStates.connected) {
        await connectToDB();
    }
  } catch(e) {console.log(e);}

  const sess: Session | null = await Sessions.findById(Buffer.from(sessionID, 'hex').toString());

  if (sess == null) return;

  if (sess.ExpiresAt < new Date().getTime()) return;

  const user = await Users.findById(sess.UserID);

  if (user == null) return;

  return { session: sess, user };
};

export const isSessionValid = async (cookies: Cookies): Promise<boolean> => {
  const sessionID = cookies.get(sessionCookieName);

  if (!sessionID) return false;

  try {
    if(connectionStatus.status != ConnectionStates.connected) {
        await connectToDB();
    }
  } catch(e) {console.log(e);}

  const sess: Session | null = await Sessions.findById(Buffer.from(sessionID, 'hex').toString());

  if (sess == null) return false;

  if (sess.ExpiresAt < new Date().getTime()) return false;

  return true;
};

export const newSession = async (cookies: Cookies, UserID: string): Promise<void> => {
  // get & delete old sessions bc fuck you
  const sessions: Session[] = await Sessions.find({ UserID });
  if (sessions.length > 0) {
    sessions.forEach(async (sess: Session) => {
      await Sessions.findByIdAndDelete(sess._id);
    });
  }

  const sessionID = hash(v4());

  await new Sessions({
    _id: sessionID,
    ExpiresAt: new Date().getTime() + MaxSession,
    UserID
  }).save();
  
  cookies.set(sessionCookieName, Buffer.from(sessionID).toString("hex"));
  return;
};
