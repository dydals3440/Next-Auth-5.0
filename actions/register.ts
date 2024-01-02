'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { RegisterSchema } from '@/app/schemas';
import { db } from '@/lib/db';
import { getUserByEmail } from '@/data/user';
// our server code never be bundle client

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // server에서 validate하는 방법
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid Fields!' };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email already in use' };
  }

  await db.user.create({
    data: {
      name,
      email,
      // salt화 시킨 패스워드 넣는게 핵심!
      password: hashedPassword,
    },
  });

  // TODO: Send Verification token email

  return { success: 'User Created!' };
};
