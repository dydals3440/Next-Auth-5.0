'use server';

import * as z from 'zod';

import { revalidatePath, revalidateTag } from 'next/cache';
import { LoginSchema } from '@/app/schemas';

// our server code never be bundle client

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // server에서 validate하는 방법
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid Fields!' };
  }
  return { success: 'Email sent!' };
};
