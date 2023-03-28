import type { LayoutServerLoad } from './$types';
import { validateSession } from '../lib/auth';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const resp = await validateSession(cookies);
  if (resp == null) {
    return { user: null };
  }
  return { user: resp.user };
};
