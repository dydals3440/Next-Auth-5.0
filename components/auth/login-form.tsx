'use client';

import * as z from 'zod';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { CardWrapper } from './card-wrapper';
import { LoginSchema } from '@/app/schemas';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FormError } from '../form-error';
import { FormSuccess } from '../form-success';
import { login } from '@/actions/login';

// page가 아니고 component이기 떄문에 export default 안함!
export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : '';

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  // 원래는 서버컴포넌트에서 pending상태를 알려면 useState를 통해 관리해야했지만, 조금 더 쉬운 useTransition 훅이 있다.
  // server login함수는 startTransition안에 넣어주고, input에 disabled속성에 isPending을 넣어주면된다!
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');
    // server action싫으면 axios.post('api',{ })
    // client -> server (next.js 14)
    startTransition(() => {
      login(values).then((data) => {
        setError(data?.error);
        // TODO: Add when we add 2FA
        setSuccess(data?.success);
      });
    });
  };
  return (
    <>
      <CardWrapper
        headerLabel='Welcome back'
        backButtonLabel="Don't have an account?"
        backButtonHref='/auth/register'
        showSocial
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='dydals3440@example.com'
                        type='email'
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='******'
                        type='password'
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error || urlError} />
            <FormSuccess message={success} />
            <Button type='submit' className='w-full' disabled={isPending}>
              Login
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
};
