'use server';

import * as z from 'zod';

import { RegisterSchema } from '@/app/schemas';

// our server code never be bundle client

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // server에서 validate하는 방법
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid Fields!' };
  }
  return { success: 'Email sent!' };
};
