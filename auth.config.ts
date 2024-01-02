import bcrypt from 'bcryptjs';
import { LoginSchema } from '@/app/schemas';
import type { NextAuthConfig } from 'next-auth';

import credentials from 'next-auth/providers/credentials';
import { getUserByEmail } from './data/user';

export default {
  providers: [
    credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          // user가 비밀번호가 없는 경우?
          // 구글이나 깃허브로 계정을 만들 경우.
          if (!user || !user.password) return null;
          //name email password
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
