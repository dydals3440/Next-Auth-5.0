import NextAuth from 'next-auth';

import authConfig from '@/auth.config';

import { getUserById } from '@/data/user';
import { db } from './lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { UserRole } from '@prisma/client';

export const {
  handlers: { GET, POST },
  // universal auth
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    // wrong -> 해당 페이지로 이동
    signIn: '/auth/login',
    // error => 우리가 만든 에러페이지로 이동하게 해줌.
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true;

      const existingUser = await getUserById(user.id);
      // 이메일 인증이 안되면 로그인 막아버림
      if (!existingUser?.emailVerified) return false;

      // TODO: ADD 2FA check

      return false;
    },
    // NEXT AUTH CALLBACKS 공식문서확인
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token }) {
      // 로그아웃을 했다는 것
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;
      // token에 role추가
      token.role = existingUser.role;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  // prisma는 db session이 동작하지 않기 떄문에 jwt strategy로 선정!
  session: { strategy: 'jwt' },
  ...authConfig,
});
