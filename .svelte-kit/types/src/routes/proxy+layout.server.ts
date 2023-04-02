// @ts-nocheck
import type { LayoutServerLoad } from './$types';
import { validateSession } from '../lib/server/auth';

export const load = async ({ cookies }: Parameters<LayoutServerLoad>[0]) => {
  const resp = await validateSession(cookies);
  if (resp == null) {
    return {};
  }
  return { user: structuredClone(resp.user) };
};
