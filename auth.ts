import NextAuth from 'next-auth';

import authConfig from '@/auth.config';

import { db } from './lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const {
  handlers: { GET, POST },
  // universal auth
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  // prisma는 db session이 동작하지 않기 떄문에 jwt strategy로 선정!
  session: { strategy: 'jwt' },
  ...authConfig,
});
