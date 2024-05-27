'use client';

import { useForm } from 'react-hook-form';
import CardParent from './CardParent';
import { z } from 'zod';
import { LoginSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import FormError from '../FormError';
import FormSuccess from '../FormSuccess';
import { login } from '@/lib/actions/login';
import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinkedError'
      ? 'Email already used with another provider'
      : '';

  const previousUrl = searchParams.get('previousUrl');

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function handleSubmit(data: z.infer<typeof LoginSchema>) {
    setError('');
    setSuccess('');

    startTransition(async () => {
      const res = await login(data, previousUrl);
      if (res?.error) {
        // form.reset();
        setError(res.error);
      }
      if (res?.success) {
        form.reset();
        setSuccess(res.success);
      }
      if (res?.twoFactor) {
        setShowTwoFactor(true);
      }
    });
  }
  return (
    <CardParent
      title="Login"
      returnLabel="Create an account"
      returnHref="/auth/register"
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <div className="space-y-4">
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="example@email.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="********"
                          type="password"
                        />
                      </FormControl>
                      <Button
                        className="px-0 font-normal"
                        variant="link"
                        size="sm"
                        asChild
                      >
                        <Link href="/auth/password-reset">
                          Forgot password?
                        </Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="twoFactorCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        {...field}
                        placeholder="123456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />

          <Button disabled={isPending} type="submit" className="w-full">
            {showTwoFactor ? 'Verify' : 'Login'}
          </Button>
        </form>
      </Form>
    </CardParent>
  );
}
