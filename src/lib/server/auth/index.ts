import type { Cookies } from '@sveltejs/kit';
import { Sessions, type Session } from '$lib/server/database/models/session';
import { connectionStatus, connectToDB } from '$lib/server/database/index';
import { Users, type User } from '$lib/server/database/models/user';
import { v4 } from 'uuid';
import { hash } from '$lib/server/hash';
import { ConnectionStates } from 'mongoose';

// one week
const MaxSession = 60480000;

const sessionCookieName = 'SiriusSession';

export const validateSession = async (cookies: Cookies): Promise<{ session: Session; user: User } | undefined> => {
  const sessionID = cookies.get(sessionCookieName);

  if (!sessionID) return;

  try {
    if (connectionStatus.status != ConnectionStates.connected) {
      await connectToDB();
    }
    // eslint-disable-next-line no-empty
  } catch (_) {}

  const sess: Session | null = await Sessions.findById(Buffer.from(sessionID, 'hex').toString());

  if (sess == null || sess.ExpiresAt < new Date().getTime()) {
    cookies.delete(sessionCookieName);
    return;
  }

  const user = await Users.findById(sess.UserID);
  if (user == null) {
    cookies.delete(sessionCookieName);
    return;
  }

  return { session: sess, user };
};

export const isSessionValid = async (cookies: Cookies): Promise<boolean> => {
  const sessionID = cookies.get(sessionCookieName);

  if (!sessionID) return false;

  try {
    if (connectionStatus.status != ConnectionStates.connected) {
      await connectToDB();
    }
    // eslint-disable-next-line no-empty
  } catch (_) {}

  const sess: Session | null = await Sessions.findById(Buffer.from(sessionID, 'hex').toString());

  if (sess == null || sess.ExpiresAt < new Date().getTime()) {
    cookies.delete(sessionCookieName);
    return false;
  }

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

  cookies.set(sessionCookieName, Buffer.from(sessionID).toString('hex'));
  return;
};

export const deleteSession = async (cookies: Cookies): Promise<void> => {
  const sess = cookies.get(sessionCookieName);
  if (!sess) return;
  await Sessions.findByIdAndDelete(Buffer.from(sess, 'hex').toString());
  cookies.delete(sessionCookieName);
};

export const getUserFromSession = async (cookies: Cookies): Promise<User> => {
  const sessionID = cookies.get(sessionCookieName);

  if (!sessionID) return {} as User;

  try {
    if (connectionStatus.status != ConnectionStates.connected) {
      await connectToDB();
    }
    // eslint-disable-next-line no-empty
  } catch (_) {}

  const sess: Session | null = await Sessions.findById(Buffer.from(sessionID, 'hex').toString());

  if (sess == null) return {} as User;

  if (sess.ExpiresAt < new Date().getTime()) return {} as User;

  const user = await Users.findById(sess.UserID);

  if (user == null) return {} as User;

  return user;
};
