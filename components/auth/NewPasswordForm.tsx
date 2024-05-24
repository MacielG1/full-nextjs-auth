'use client';

import { useForm } from 'react-hook-form';
import CardParent from './CardParent';
import { z } from 'zod';
import { NewPasswordSchema } from '@/lib/schemas';
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
import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { createNewPassword } from '@/lib/actions/newPassword';

export default function NewPasswordForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  async function handleSubmit(data: z.infer<typeof NewPasswordSchema>) {
    setError('');
    setSuccess('');

    startTransition(async () => {
      const res = await createNewPassword({ data, token });
      setError(res.error);
      setSuccess(res.success);
    });
  }
  return (
    <CardParent
      title="New Password"
      returnLabel="Return to Login"
      returnHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="********" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />

          <Button disabled={isPending} type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </CardParent>
  );
}
