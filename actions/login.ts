'use server';

import * as z from 'zod';

import { revalidatePath, revalidateTag } from 'next/cache';
import { LoginSchema } from '@/app/schemas';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// our server code never be bundle client

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // server에서 validate하는 방법
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid Fields!' };
  }

  const { email, password } = validatedFields.data;

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
