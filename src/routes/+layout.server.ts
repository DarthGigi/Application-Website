import type { LayoutServerLoad } from './$types';
import { validateSession } from '../lib/server/auth';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const resp = await validateSession(cookies);
  if (resp == null) {
    return {};
  }
  // devalue doesn't like "_id"
  resp.user.password = '';
  return { user: structuredClone(resp.user) };
};
