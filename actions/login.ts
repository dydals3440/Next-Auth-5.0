'use server';

import * as z from 'zod';

import { revalidatePath, revalidateTag } from 'next/cache';
import { LoginSchema } from '@/app/schemas';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { generateVerificationToken } from '@/lib/token';
import { getUserByEmail } from '@/data/user';

// our server code never be bundle client

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // server에서 validate하는 방법
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid Fields!' };
  }

  const { email, password } = validatedFields.data;
  // 이메일 인가 인증 추가 로직
  const existingUser = await getUserByEmail(email);

  // 유저가 없으면 없다고 메시지 띄움
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email does not exist' };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    return { success: 'Confirmation email Sent' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    // TODO
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid Credentials' };
        default:
          return { error: 'Something went wrong!' };
      }
    }

    throw error;
  }
};
